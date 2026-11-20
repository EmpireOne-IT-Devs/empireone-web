<?php

namespace Tests\Feature;

use App\Http\Middleware\EnsureAccountEmployeeComplete;
use App\Jobs\SendAssetItemRequestEmail;
use App\Jobs\SendAssetLiabilityFormEmail;
use App\Models\AssetInventory\AssetDevice;
use App\Models\AssetInventory\AssetItemRequest;
use App\Models\AssetInventory\AssetLiabilityForm;
use App\Models\AssetInventory\AssetPart;
use App\Models\User;
use App\Services\AssetItemRequestService;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\Mailer\Exception\TransportException;
use Tests\TestCase;

class AssetItemRequestTest extends TestCase
{
    private const API = '/api/asset_inventory/item_requests';

    private const LIABILITY_API = '/api/asset_inventory/liability_forms';

    private const SIGNATURE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZsAAAAASUVORK5CYII=';

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'database.default' => 'item_request_testing',
            'database.connections.item_request_testing' => [
                'driver' => 'sqlite', 'database' => ':memory:', 'foreign_key_constraints' => true,
            ],
            'mail.default' => 'array',
            'mail.from.address' => 'inventory@example.test',
        ]);
        foreach (array_keys(config('item_request.steps')) as $step) {
            config(['item_request.steps.'.$step.'.email' => 'reviewer@example.test']);
        }
        Queue::fake();

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->unsignedTinyInteger('role');
            $table->timestamps();
        });
        foreach (['e_r_leaders', 'sites', 'locations', 'accounts'] as $tableName) {
            Schema::create($tableName, fn (Blueprint $table) => $table->id());
        }
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });
        foreach (glob(database_path('migrations'.DIRECTORY_SEPARATOR.'2026_11_10_*_create_asset_*_table.php')) as $path) {
            (require $path)->up();
        }
        (require database_path('migrations/2026_02_24_104636_create_account_employees_table.php'))->up();
        (require database_path('migrations/2026_11_21_000000_create_asset_item_requests_tables.php'))->up();
        (require database_path('migrations/2026_11_21_000001_create_asset_liability_forms_table.php'))->up();
        (require database_path('migrations/2026_11_21_000002_add_paper_record_to_asset_liability_forms.php'))->up();
    }

    public function test_ordered_approvals_use_real_people_and_queue_only_current_notices(): void
    {
        $creator = $this->user('creator');
        $reviewer = $this->user('reviewer');
        $employee = $this->employee();
        $asset = $this->asset();
        $this->actingAs($creator, 'sanctum');
        $created = $this->postJson(self::API, $this->values($employee, $asset))->assertCreated()
            ->assertJsonPath('data.assigneeId', 'EMP-100')
            ->assertJsonPath('data.assigneeEmail', $employee->email)
            ->assertJsonPath('data.department', 'Operations')
            ->assertJsonPath('data.requesterEmail', $creator->email)
            ->assertJsonPath('data.canAct', false)
            ->assertJsonCount(3, 'data.approvals')->json('data');
        $url = self::API.'/'.$created['uuid'];
        $this->postJson($url.'/approve', ['step' => 'department_head'])->assertForbidden();

        $firstNotice = Queue::pushed(SendAssetItemRequestEmail::class)->first();
        $this->assertSame('department_head', $firstNotice->stepKey);
        $firstNotice->handle();
        $transport = Mail::mailer()->getSymfonyTransport();
        $sent = $transport->messages()->first()->getOriginalMessage();
        $this->assertSame($reviewer->email, $sent->getTo()[0]->getAddress());
        $this->assertStringContainsString($created['uuid'], $sent->getHtmlBody());

        $this->actingAs($reviewer, 'sanctum');
        $this->getJson($url)->assertOk()->assertJsonPath('data.canAct', true);
        $this->postJson($url.'/approve', ['step' => 'general_manager'])->assertConflict();
        $this->postJson($url.'/approve', ['step' => 'department_head'])->assertOk()
            ->assertJsonPath('data.status', 'In Progress');
        $firstNotice->handle();
        $this->assertCount(1, $transport->messages());
        $this->postJson($url.'/approve', ['step' => 'department_head'])->assertConflict();
        $this->postJson($url.'/approve', ['step' => 'asset_custodian'])->assertOk()
            ->assertJsonPath('data.approvals.1.status', 'approved');
        $this->postJson($url.'/approve', ['step' => 'general_manager'])->assertOk()
            ->assertJsonPath('data.status', 'Approved')->assertJsonPath('data.canAct', false);
        $this->postJson($url.'/approve', ['step' => 'general_manager'])->assertConflict();
        Queue::assertPushed(SendAssetItemRequestEmail::class, 3);
        $this->getJson(self::API.'?status=Approved&search=EMP-100')->assertOk()
            ->assertJsonPath('meta.total', 1)->assertJsonPath('data.0.uuid', $created['uuid']);
        $this->postJson(self::API, $this->values($employee, $asset))->assertUnprocessable()
            ->assertJsonValidationErrors('assetUuid');
    }

    public function test_reservation_releases_on_rejection_and_lookups_exclude_unavailable_rows(): void
    {
        $employee = $this->employee();
        $asset = $this->asset();
        $unavailable = $this->asset('LT-999', 'Assigned');
        $this->actingAs($this->user('reviewer'), 'sanctum');
        $this->getJson(self::API.'/lookups?assetSearch=LT&employeeSearch=EMP-100')->assertOk()
            ->assertJsonCount(1, 'data.assets')->assertJsonPath('data.assets.0.uuid', $asset->uuid)
            ->assertJsonPath('data.employees.0.id', $employee->id);
        $this->postJson(self::API, $this->values($employee, $unavailable))->assertUnprocessable()
            ->assertJsonValidationErrors('assetUuid');
        $uuid = $this->postJson(self::API, $this->values($employee, $asset))->assertCreated()->json('data.uuid');
        $this->getJson(self::API.'/lookups?assetSearch=LT')->assertOk()->assertJsonCount(0, 'data.assets');
        $this->postJson(self::API.'/'.$uuid.'/reject', ['step' => 'department_head'])->assertUnprocessable()
            ->assertJsonValidationErrors('remarks');
        $this->postJson(self::API.'/'.$uuid.'/reject', ['step' => 'department_head', 'remarks' => 'Not required.'])
            ->assertOk()->assertJsonPath('data.status', 'Rejected');
        $this->assertDatabaseCount('asset_liability_forms', 0);
        $this->postJson(self::API, $this->values($employee, $asset))->assertCreated();
        Queue::assertPushed(SendAssetItemRequestEmail::class, fn ($job) => $job->expectedStatus === 'Rejected' && $job->stepKey === null);
    }

    public function test_database_rejects_competing_asset_reservations(): void
    {
        $this->actingAs($this->user('creator'), 'sanctum');
        $uuid = $this->postJson(self::API, $this->values($this->employee(), $this->asset()))
            ->assertCreated()->json('data.uuid');
        $request = AssetItemRequest::where('uuid', $uuid)->firstOrFail();
        $this->expectException(UniqueConstraintViolationException::class);
        $request->replicate()->fill(['uuid' => (string) Str::uuid(), 'item_request_id' => 'IR-other'])->save();
    }

    public function test_rolling_back_creation_discards_the_request_and_approval_email(): void
    {
        $admin = $this->user('creator');
        $values = $this->values($this->employee(), $this->asset());
        DB::beginTransaction();
        try {
            $request = app(AssetItemRequestService::class)->create($admin, $values);
            $this->assertCount(3, $request->steps);
            Queue::assertNothingPushed();
        } finally {
            DB::rollBack();
        }

        $this->assertDatabaseCount('asset_item_requests', 0);
        $this->assertDatabaseCount('asset_item_request_steps', 0);
        Queue::assertNothingPushed();
    }

    public function test_non_admins_cannot_access_api_or_self_approve_and_unverified_approvers_cannot_decide(): void
    {
        $this->getJson(self::API)->assertUnauthorized();
        $employee = $this->employee();
        $asset = $this->asset();
        $this->actingAs($employee, 'sanctum');
        $this->getJson(self::API)->assertForbidden();
        $this->getJson(self::API.'/lookups')->assertForbidden();
        $this->postJson(self::API, $this->values($employee, $asset))->assertForbidden();

        $reviewer = $this->user('reviewer');
        $reviewer->forceFill(['email_verified_at' => null])->save();
        $this->actingAs($reviewer, 'sanctum');
        $this->postJson(self::API, array_replace($this->values($employee, $asset), ['untilDate' => '2026-12-01']))
            ->assertUnprocessable()->assertJsonValidationErrors('fromDate');
        $uuid = $this->postJson(self::API, $this->values($employee, $asset))->assertCreated()->json('data.uuid');
        $this->postJson(self::API.'/'.$uuid.'/approve', ['step' => 'department_head'])->assertForbidden();
        $this->actingAs($employee, 'sanctum');
        $this->getJson(self::API.'/'.$uuid)->assertForbidden();
        $this->postJson(self::API.'/'.$uuid.'/approve', ['step' => 'department_head'])->assertForbidden();
    }

    public function test_final_approval_creates_one_form_and_only_assignee_can_acknowledge_and_issue(): void
    {
        $employee = $this->employee();
        $reviewer = $this->user('reviewer');
        $asset = $this->asset();
        $request = $this->approveItem($reviewer, $this->values($employee, $asset));
        $this->postJson(self::API.'/'.$request.'/approve', ['step' => 'general_manager'])->assertConflict();
        $form = AssetLiabilityForm::sole();
        $url = self::LIABILITY_API.'/'.$form->uuid;
        $this->assertSame(AssetLiabilityForm::PENDING, $form->status);
        $this->assertSame('Available', $asset->refresh()->availability);

        Queue::assertPushed(SendAssetLiabilityFormEmail::class, 1);
        $this->postJson($url.'/resend')->assertAccepted();
        Queue::pushed(SendAssetLiabilityFormEmail::class)->first()->handle();
        $message = Mail::mailer()->getSymfonyTransport()->messages()->first()->getOriginalMessage();
        $this->assertSame($employee->email, $message->getTo()[0]->getAddress());
        $this->assertStringContainsString(route(AssetLiabilityForm::SIGNING_ROUTE, $form), $message->getHtmlBody());
        $this->assertStringContainsString('Review Asset Accountability Form', $message->getHtmlBody());
        $this->assertStringContainsString('sign in to your account', $message->getHtmlBody());
        $this->assertStringContainsString(route(AssetLiabilityForm::SIGNING_ROUTE, $form), $message->getTextBody());
        $this->assertNotNull($form->refresh()->email_sent_at);
        $payload = ['accepted' => true, 'templateVersion' => $form->template_version];
        $this->postJson($url.'/acknowledge', $payload)->assertForbidden();
        $this->actingAs($this->user('other-employee', User::ROLE_EMPLOYEE), 'sanctum');
        $this->getJson($url)->assertForbidden();
        $this->postJson($url.'/acknowledge', $payload)->assertForbidden();

        $this->actingAs($employee, 'sanctum');
        $this->getJson(self::LIABILITY_API)->assertForbidden();
        $this->getJson($url)->assertOk()->assertHeader('Cache-Control', 'no-store, private')
            ->assertJsonPath('data.document.items.0.assetType', 'Laptop')->assertJsonPath('data.canAcknowledge', true);
        $this->postJson($url.'/acknowledge', [...$payload, 'accepted' => false])->assertUnprocessable();
        $this->postJson($url.'/acknowledge', [...$payload, 'templateVersion' => 'stale'])->assertConflict();
        $this->postJson($url.'/acknowledge', $payload)->assertUnprocessable()->assertJsonValidationErrors('signature');
        DB::table('account_employees')->where('user_id', $employee->id)->update(['signature' => self::SIGNATURE]);
        $signed = $this->postJson($url.'/acknowledge', $payload)->assertOk()
            ->assertJsonPath('data.status', AssetLiabilityForm::ACKNOWLEDGED)
            ->assertJsonPath('data.signature', self::SIGNATURE)->json('data');
        DB::table('account_employees')->where('user_id', $employee->id)->update(['signature' => null]);
        $this->postJson($url.'/acknowledge', $payload)->assertOk()
            ->assertJsonPath('data.acknowledgedAt', $signed['acknowledgedAt'])->assertJsonPath('data.signature', self::SIGNATURE);
        $this->assertNotSame(self::SIGNATURE, $form->refresh()->getRawOriginal('signature'));
        $this->assertSame('Assigned', $asset->refresh()->availability);
        $this->assertSame($employee->name, $asset->issued_to);

        $this->actingAs($reviewer, 'sanctum');
        $this->getJson(self::API.'/'.$request)->assertOk()->assertJsonPath('data.status', AssetItemRequest::ISSUED)
            ->assertJsonPath('data.issuedAssetTag', $asset->asset_tag);
        $this->getJson(self::LIABILITY_API.'?status=Acknowledged&search=EMP-100')->assertOk()
            ->assertJsonPath('meta.total', 1)->assertJsonMissingPath('data.0.signature');
        $this->postJson($url.'/void', ['reason' => 'Too late'])->assertConflict();
        $this->postJson($url.'/resend')->assertConflict();
    }

    public function test_changed_inventory_blocks_acknowledgment_and_void_releases_the_reservation(): void
    {
        $employee = $this->employee();
        $asset = $this->asset();
        $reviewer = $this->user('reviewer');
        $values = $this->values($employee, $asset);
        $request = $this->approveItem($reviewer, $values);
        $form = AssetLiabilityForm::sole();
        $url = self::LIABILITY_API.'/'.$form->uuid;
        $this->postJson($url.'/void', [])->assertUnprocessable()->assertJsonValidationErrors('reason');
        $asset->update(['condition' => 'Damaged']);
        $this->actingAs($employee, 'sanctum');
        $this->postJson($url.'/acknowledge', ['accepted' => true, 'templateVersion' => $form->template_version])
            ->assertConflict();
        $this->postJson($url.'/void', ['reason' => 'Unauthorized'])->assertForbidden();
        $this->actingAs($reviewer, 'sanctum');
        $this->postJson($url.'/void', ['reason' => 'Condition changed'])->assertOk()
            ->assertJsonPath('data.status', AssetLiabilityForm::VOIDED)
            ->assertJsonPath('data.voidReason', 'Condition changed');
        $this->getJson(self::API.'/'.$request)->assertOk()->assertJsonPath('data.status', AssetItemRequest::CANCELLED);
        $this->postJson(self::API, $values)->assertCreated();
    }

    public function test_failed_email_leaves_form_pending_and_retryable(): void
    {
        $this->approveItem($this->user('reviewer'), $this->values($this->employee(), $this->asset()));
        $form = AssetLiabilityForm::sole();
        $job = Queue::pushed(SendAssetLiabilityFormEmail::class)->first();
        Mail::shouldReceive('send')->once()->andThrow(new TransportException('Test transport unavailable'));

        try {
            $job->handle();
            $this->fail('A failed delivery must be reported to the queue for retry.');
        } catch (TransportException) {
            $this->assertSame(AssetLiabilityForm::PENDING, $form->refresh()->status);
            $this->assertNull($form->email_sent_at);
        }
    }

    public function test_email_link_returns_to_the_assignees_signing_page_after_login(): void
    {
        $this->withoutVite();
        config(['inertia.testing.page_paths' => [resource_path('js/app/pages')]]);
        $employee = $this->employee();
        $reviewer = $this->user('reviewer');
        $this->approveItem($reviewer, $this->values($employee, $this->asset()));
        $form = AssetLiabilityForm::sole();
        $url = route(AssetLiabilityForm::SIGNING_ROUTE, $form);

        $this->actingAs($reviewer, 'web')->get($url)->assertForbidden();
        auth()->guard('web')->logout();
        $this->get($url)->assertRedirect(route('login'))->assertSessionHas('url.intended', $url);
        $login = $this->post(route('auth.login'), ['login_id' => $employee->email, 'password' => 'password']);
        $login->assertRedirect($url);
        $this->assertAuthenticatedAs($employee, 'web');
        $cookie = $login->getCookie(config('session.cookie'));
        $this->withCookie($cookie->getName(), $cookie->getValue());
        $this->get($url)->assertOk()->assertInertia(fn ($page) => $page
            ->component('acknowledgment/liability_form/page')
            ->where('id', $form->uuid));
    }

    public function test_admin_detail_page_passes_the_form_uuid_to_inertia(): void
    {
        $this->withoutVite()->withoutMiddleware(EnsureAccountEmployeeComplete::class);
        config(['inertia.testing.page_paths' => [resource_path('js/app/pages')]]);
        $reviewer = $this->user('reviewer');
        $this->approveItem($reviewer, $this->values($this->employee(), $this->asset()));
        $form = AssetLiabilityForm::sole();

        $this->actingAs($reviewer, 'web')->get('/accounts/administrator/asset_inventory/liability_form/'.$form->uuid)
            ->assertOk()->assertInertia(fn ($page) => $page
            ->component('accounts/_administrator/asset_inventory/liability_form/id/page')
            ->where('id', $form->uuid));
    }

    public function test_stock_is_decremented_only_once_and_final_approval_rolls_back_if_asset_is_missing(): void
    {
        $employee = $this->employee();
        DB::table('account_employees')->where('user_id', $employee->id)->update(['signature' => self::SIGNATURE]);
        $reviewer = $this->user('reviewer');
        $this->actingAs($reviewer, 'sanctum');
        $asset = $this->asset();
        $item = $this->postJson(self::API, $this->values($employee, $asset))->assertCreated()->json('data.uuid');
        foreach (['department_head', 'asset_custodian'] as $step) {
            $this->postJson(self::API.'/'.$item.'/approve', ['step' => $step])->assertOk();
        }
        $asset->delete();
        $this->postJson(self::API.'/'.$item.'/approve', ['step' => 'general_manager'])->assertConflict();
        $this->getJson(self::API.'/'.$item)->assertOk()
            ->assertJsonPath('data.status', AssetItemRequest::IN_PROGRESS)->assertJsonPath('data.approvals.2.status', 'pending');
        $this->assertDatabaseCount('asset_liability_forms', 0);

        $part = AssetPart::create(['asset_tag' => 'PART-001', 'name' => 'Adapter', 'part_type' => 'Adapter', 'quantity' => 3, 'status' => 'Active']);
        $this->approveItem($reviewer, [...$this->values($employee, $asset), 'assetType' => 'parts', 'assetUuid' => $part->uuid]);
        $form = AssetLiabilityForm::sole();
        $this->actingAs($employee, 'sanctum');
        $url = self::LIABILITY_API.'/'.$form->uuid.'/acknowledge';
        foreach (range(1, 2) as $attempt) {
            $this->postJson($url, ['accepted' => true, 'templateVersion' => $form->template_version])->assertOk();
        }
        $this->assertSame(2, $part->refresh()->quantity);
    }

    public function test_admin_records_multiple_assets_from_paper_without_issuing_or_notifying(): void
    {
        $employee = $this->employee();
        $admin = $this->user('recorder');
        $asset = $this->asset();
        $this->actingAs($admin, 'sanctum');
        DB::table('account_employees')->where('user_id', $employee->id)->update(['status' => 'Resigned']);
        $profileId = $this->getJson(self::LIABILITY_API.'/paper/employees?search=EMP-100')
            ->assertOk()->assertJsonPath('data.0.employeeNumber', 'EMP-100')->json('data.0.id');
        $form = $this->postJson(self::LIABILITY_API.'/paper', [
            'employeeProfileId' => $profileId,
            'signedDate' => '2025-01-08',
            'issueDate' => '2025-01-06',
            'items' => [
                ['assetType' => 'Laptop', 'brandModel' => 'Latitude', 'assetTag' => $asset->asset_tag],
                ['assetType' => 'Headset', 'brandModel' => 'USB headset'],
            ],
        ])->assertCreated()
            ->assertJsonPath('data.paperSignedDate', '2025-01-08')
            ->assertJsonPath('data.issueDate', '2025-01-06')
            ->assertJsonPath('data.status', AssetLiabilityForm::ACKNOWLEDGED)
            ->assertJsonPath('data.source', 'paper')
            ->assertJsonPath('data.signature', null)
            ->assertJsonPath('data.acknowledgedAt', null)
            ->assertJsonPath('data.hasPaperScan', false)
            ->assertJsonCount(2, 'data.document.items')->json('data');
        $this->assertDatabaseHas('asset_liability_forms', [
            'uuid' => $form['uuid'], 'recorded_by' => $admin->id, 'item_request_id' => null,
        ]);
        $this->assertSame('Available', $asset->refresh()->availability);
        $this->assertDatabaseCount('asset_item_requests', 0);
        Queue::assertNothingPushed();
        $this->getJson(self::LIABILITY_API.'?source=paper')->assertOk()->assertJsonPath('data.0.uuid', $form['uuid']);
        $this->getJson(self::LIABILITY_API.'?source=digital')->assertOk()->assertJsonPath('meta.total', 0);
        $this->actingAs($admin, 'web')->get(route('asset-liability-forms.paper.scan', $form['uuid']))->assertNotFound();
    }

    public function test_original_scan_is_private_and_uploads_are_validated(): void
    {
        Storage::fake('liability_paper_scans');
        $employee = $this->employee();
        $admin = $this->user('recorder');
        $profileId = DB::table('account_employees')->where('user_id', $employee->id)->value('id');
        $values = [
            'employeeProfileId' => $profileId, 'signedDate' => '2025-01-08',
            'items' => [['assetType' => 'Laptop', 'brandModel' => 'Latitude']],
        ];
        $this->actingAs($employee, 'sanctum');
        $this->postJson(self::LIABILITY_API.'/paper', $values)->assertForbidden();
        $this->getJson(self::LIABILITY_API.'/paper/employees?search=EMP')->assertForbidden();
        $this->actingAs($admin, 'sanctum');
        $this->postJson(self::LIABILITY_API.'/paper', [...$values, 'signedDate' => '2999-01-01'])
            ->assertUnprocessable()->assertJsonValidationErrors('signedDate');
        $this->postJson(self::LIABILITY_API.'/paper', [...$values, 'issueDate' => '2025-01-09',
            'items' => [['assetType' => 'Laptop', 'brandModel' => 'Latitude', 'purchaseValue' => '2.001']],
        ])->assertUnprocessable()->assertJsonValidationErrors(['issueDate', 'items.0.purchaseValue']);
        $invalid = UploadedFile::fake()->createWithContent('bad.pdf', 'not a scan');
        $this->postJson(self::LIABILITY_API.'/paper', [...$values,
            'scan' => new UploadedFile($invalid->getPathname(), 'bad.pdf', 'application/pdf', null, true),
        ])
            ->assertUnprocessable()->assertJsonValidationErrors('scan');
        $this->assertDatabaseCount('asset_liability_forms', 0);

        $contents = base64_decode(explode(',', self::SIGNATURE)[1], true);
        $uuid = $this->post(self::LIABILITY_API.'/paper', [...$values, 'scan' => UploadedFile::fake()->createWithContent('original.png', $contents)], ['Accept' => 'application/json'])
            ->assertCreated()->assertJsonPath('data.hasPaperScan', true)
            ->assertJsonMissingPath('data.paper_scan_path')->json('data.uuid');
        $url = route('asset-liability-forms.paper.scan', $uuid);
        $this->actingAs($employee, 'sanctum')->getJson(self::LIABILITY_API.'/'.$uuid)->assertForbidden();
        $this->actingAs($employee, 'web')->getJson($url)->assertForbidden();
        $download = $this->actingAs($admin, 'web')->get($url)->assertOk()
            ->assertHeader('Cache-Control', 'no-store, private')
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('Content-Type', 'application/octet-stream')->assertDownload('LF-0001-paper-scan.png');
        $this->assertSame($contents, $download->streamedContent());
    }

    private function approveItem(User $reviewer, array $values): string
    {
        $this->actingAs($reviewer, 'sanctum');
        $uuid = $this->postJson(self::API, $values)->assertCreated()->json('data.uuid');
        foreach (array_keys(config('item_request.steps')) as $step) {
            $this->postJson(self::API.'/'.$uuid.'/approve', ['step' => $step])->assertOk();
        }

        return $uuid;
    }

    private function user(string $name, int $role = User::ROLE_ADMIN): User
    {
        $user = new User([
            'name' => ucfirst($name), 'email' => $name.'@example.test', 'role' => $role, 'password' => 'password',
        ]);
        $user->forceFill(['email_verified_at' => now()])->save();

        return $user;
    }

    private function employee(): User
    {
        $employee = $this->user('employee', User::ROLE_EMPLOYEE);
        $department = DB::table('departments')->insertGetId(['name' => 'Operations']);
        DB::table('account_employees')->insert([
            'user_id' => $employee->id, 'department_id' => $department, 'employee_id' => 'EMP-100', 'status' => 'Regular',
        ]);

        return $employee;
    }

    private function asset(string $tag = 'LT-001', string $availability = 'Available'): AssetDevice
    {
        return AssetDevice::create([
            'asset_tag' => $tag, 'device_type' => 'Laptop', 'brand' => 'Dell', 'model' => 'Latitude',
            'status' => 'Working', 'availability' => $availability,
        ]);
    }

    private function values(User $employee, AssetDevice $asset): array
    {
        return [
            'assetType' => 'devices', 'assetUuid' => $asset->uuid, 'assigneeId' => $employee->id,
            'requestType' => 'New Assignment', 'priority' => 'Normal', 'justification' => 'New employee equipment.',
        ];
    }
}
