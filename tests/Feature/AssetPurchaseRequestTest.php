<?php

namespace Tests\Feature;

use App\Jobs\SendAssetPurchaseRequestEmail;
use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Assert;
use Tests\TestCase;

class AssetPurchaseRequestTest extends TestCase
{
    private const API = '/api/asset_inventory/purchase_requests';

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'database.default' => 'purchase_request_testing',
            'database.connections.purchase_request_testing' => [
                'driver' => 'sqlite', 'database' => ':memory:', 'foreign_key_constraints' => true,
            ],
            'filesystems.disks.purchase_quotations.bucket' => 'private-purchase-quotation-test',
            'mail.default' => 'array',
            'mail.from.address' => 'purchasing@example.test',
        ]);
        Queue::fake();
        foreach (array_keys(config('purchase_request.steps')) as $step) {
            config(['purchase_request.steps.'.$step.'.email' => 'reviewer@example.test']);
        }

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->unsignedTinyInteger('role');
            $table->timestamps();
        });
        (require database_path('migrations/2026_11_18_230000_create_asset_purchase_requests_tables.php'))->up();
    }

    public function test_list_and_create_routes_persist_data_and_scope_it_to_the_owner_and_reviewer(): void
    {
        $this->getJson(self::API)->assertUnauthorized();
        $this->actingAs($this->account('employee', User::ROLE_EMPLOYEE), 'sanctum');
        $this->getJson(self::API)->assertForbidden();
        $this->postJson(self::API, $this->values())->assertForbidden();

        $owner = $this->account('owner');
        $owner->update(['name' => null]);
        $this->actingAs($owner, 'sanctum');
        $this->getJson(self::API)->assertOk()->assertJsonPath('meta.total', 0);
        $saved = $this->postJson(self::API, $this->values() + [
            'requesterEmail' => 'forged@example.test', 'status' => 'Approved',
        ])->assertCreated()
            ->assertJsonPath('data.totalAmount', 300.5)
            ->assertJsonPath('data.requesterName', 'owner@example.test')
            ->assertJsonPath('data.requesterEmail', 'owner@example.test')
            ->assertJsonPath('data.status', 'Pending Approval')
            ->assertJsonPath('data.canAct', false)
            ->assertJsonCount(4, 'data.approvals')
            ->json('data');

        $this->getJson(self::API.'?search='.$saved['id'])->assertOk()
            ->assertJsonPath('data.0.uuid', $saved['uuid'])->assertJsonPath('meta.per_page', 10);
        $this->getJson(self::API.'/'.$saved['uuid'])->assertOk()->assertJsonPath('data.itemName', 'Monitor');
        $this->postJson(self::API.'/'.$saved['uuid'].'/approve', ['step' => 'department_head'])->assertForbidden();

        $this->actingAs($this->account('other'), 'sanctum');
        $this->getJson(self::API.'?search=Monitor')->assertOk()->assertJsonPath('meta.total', 0);
        $this->getJson(self::API.'/'.$saved['uuid'])->assertForbidden();

        $this->actingAs($this->account('reviewer'), 'sanctum');
        $this->getJson(self::API.'?priority=High')->assertOk()->assertJsonPath('meta.total', 1);
        $this->getJson(self::API.'/'.$saved['uuid'])->assertOk()->assertJsonPath('data.canAct', true);
    }

    public function test_decisions_require_the_current_step_and_record_the_approver_and_remarks(): void
    {
        $this->actingAs($this->account('reviewer'), 'sanctum');
        $path = self::API.'/'.$this->postJson(self::API, $this->values())->assertCreated()->json('data.uuid');
        $this->postJson($path.'/approve', ['step' => 'finance'])->assertConflict();
        $this->postJson($path.'/reject', ['step' => 'department_head', 'remarks' => '   '])
            ->assertUnprocessable()->assertJsonValidationErrors('remarks');
        $this->postJson($path.'/approve', ['step' => 'department_head', 'remarks' => 'Reviewed.'])->assertOk()
            ->assertJsonPath('data.status', 'In Progress')->assertJsonPath('data.approvals.0.approverName', 'Reviewer')
            ->assertJsonPath('data.approvals.0.remarks', 'Reviewed.');
        $this->postJson($path.'/approve', ['step' => 'department_head'])->assertConflict();
        foreach (['finance', 'procurement', 'general_manager'] as $step) {
            $this->postJson($path.'/approve', ['step' => $step])->assertOk();
        }
        $this->getJson($path)->assertOk()->assertJsonPath('data.status', 'Approved')->assertJsonPath('data.canAct', false);

        $second = self::API.'/'.$this->postJson(self::API, $this->values())->assertCreated()->json('data.uuid');
        $this->postJson($second.'/reject', ['step' => 'department_head', 'remarks' => 'Not needed.'])->assertOk()
            ->assertJsonPath('data.status', 'Rejected')->assertJsonPath('data.canAct', false);
        $this->postJson($second.'/approve', ['step' => 'finance'])->assertConflict();
    }

    public function test_quotation_is_optional_validated_private_and_downloadable_only_after_authorization(): void
    {
        $disk = Storage::fake('purchase_quotations');
        $disk->buildTemporaryUrlsUsing(function ($path, $expiry, $options) {
            Assert::assertStringEndsWith('/quotation.pdf', $path);
            Assert::assertEqualsWithDelta(300, now()->diffInSeconds($expiry), 2);
            Assert::assertSame('attachment; filename="Vendor-quote.pdf"', $options['ResponseContentDisposition']);

            return 'https://storage.example.test/signed';
        });

        $this->actingAs($this->account('owner'), 'sanctum');
        $html = UploadedFile::fake()->createWithContent('quote.pdf', '<html>Not a PDF</html>');
        $this->post(self::API, $this->values() + [
            'supplierQuotation' => new UploadedFile($html->getPathname(), 'quote.pdf', 'application/pdf', null, true),
        ], ['Accept' => 'application/json'])->assertUnprocessable()->assertJsonValidationErrors('supplierQuotation');

        $response = $this->post(self::API, $this->values() + [
            'supplierQuotation' => UploadedFile::fake()->createWithContent('Vendor quote.pdf', "%PDF-1.4\n%%EOF"),
        ], ['Accept' => 'application/json'])->assertCreated()->assertJsonPath('data.quotationName', 'Vendor-quote.pdf')
            ->assertJsonMissingPath('data.quotation_path');
        $uuid = $response->json('data.uuid');
        $disk->assertExists('purchase-requests/'.$uuid.'/quotation.pdf');
        $path = self::API.'/'.$uuid.'/quotation';
        $this->getJson($path)->assertOk()->assertJsonPath('data.url', 'https://storage.example.test/signed');
        $this->actingAs($this->account('other'), 'sanctum');
        $this->getJson($path)->assertForbidden();
        $this->actingAs($this->account('reviewer'), 'sanctum');
        $this->getJson($path)->assertOk();
    }

    public function test_emails_follow_the_approval_sequence_without_notifying_for_duplicate_decisions(): void
    {
        $keys = array_keys(config('purchase_request.steps'));
        $reviewers = [];
        foreach ($keys as $key) {
            $reviewers[$key] = $this->account($key);
            config(['purchase_request.steps.'.$key.'.email' => $reviewers[$key]->email]);
        }
        $owner = $this->account('owner');
        $this->actingAs($owner, 'sanctum');
        $uuid = $this->postJson(self::API, $this->values())->assertCreated()->json('data.uuid');
        $path = self::API.'/'.$uuid.'/approve';
        $expectedRecipients = [];

        foreach ($keys as $index => $key) {
            Queue::assertPushed(SendAssetPurchaseRequestEmail::class, $index + 1);
            Queue::pushed(SendAssetPurchaseRequestEmail::class)->last()->handle();
            $expectedRecipients[] = $reviewers[$key]->email;

            $this->actingAs($reviewers[$key], 'sanctum');
            $this->postJson($path, ['step' => $key])->assertOk();
            $this->postJson($path, ['step' => $key])->assertConflict();
        }
        Queue::assertPushed(SendAssetPurchaseRequestEmail::class, 5);
        Queue::pushed(SendAssetPurchaseRequestEmail::class)->last()->handle();
        $expectedRecipients[] = $owner->email;
        // A delayed email for an already-approved step no longer needs to be sent.
        Queue::pushed(SendAssetPurchaseRequestEmail::class)->first()->handle();

        $messages = Mail::mailer()->getSymfonyTransport()->messages()->map->getOriginalMessage();
        $this->assertSame($expectedRecipients, $messages->map(fn ($message) => $message->getTo()[0]->getAddress())->all());
        $this->assertStringContainsString('completed all approval steps', $messages->last()->getTextBody());
        $this->assertStringContainsString('Department Head', $messages->first()->getHtmlBody());
        $this->assertStringContainsString('completed all approval steps', $messages->last()->getHtmlBody());
        $url = route('asset-purchase-requests.page.show', ['id' => $uuid]);
        foreach ($messages as $message) {
            $this->assertStringContainsString('/accounts/administrator/asset_inventory/purchase_request/'.$uuid, $message->getTextBody());
            $this->assertStringContainsString('href="'.e($url).'"', $message->getHtmlBody());
            $this->assertStringContainsString('View Purchase Request</a>', $message->getHtmlBody());
            $this->assertSame([], $message->getAttachments());
        }
    }

    public function test_rejection_notifies_only_the_owner_and_rolled_back_requests_do_not_queue_mail(): void
    {
        $owner = $this->account('owner');
        $this->actingAs($owner, 'sanctum');
        DB::beginTransaction();
        try {
            $this->postJson(self::API, $this->values())->assertCreated();
            Queue::assertNothingPushed();
        } finally {
            DB::rollBack();
        }
        Queue::assertNothingPushed();

        $uuid = $this->postJson(self::API, $this->values())->assertCreated()->json('data.uuid');
        $this->actingAs($this->account('reviewer'), 'sanctum');
        $this->postJson(self::API.'/'.$uuid.'/reject', ['step' => 'department_head', 'remarks' => 'Not needed.'])->assertOk();
        Queue::assertPushed(SendAssetPurchaseRequestEmail::class, 2);
        foreach (Queue::pushed(SendAssetPurchaseRequestEmail::class) as $job) {
            $job->handle();
        }

        $messages = Mail::mailer()->getSymfonyTransport()->messages();
        $this->assertCount(1, $messages);
        $message = $messages->first()->getOriginalMessage();
        $this->assertSame($owner->email, $message->getTo()[0]->getAddress());
        $this->assertStringContainsString('was rejected', $message->getTextBody());
        $this->assertStringNotContainsString('Not needed.', $message->getTextBody());
        $this->assertStringContainsString('was rejected', $message->getHtmlBody());
        $this->assertStringNotContainsString('Not needed.', $message->getHtmlBody());
    }

    private function account(string $name, int $role = User::ROLE_ADMIN): User
    {
        $user = new User([
            'name' => ucfirst($name), 'email' => $name.'@example.test', 'role' => $role,
            'password' => 'test-password',
        ]);
        $user->email_verified_at = now();
        $user->save();

        return $user;
    }

    private function values(): array
    {
        return [
            'itemName' => 'Monitor', 'department' => 'IT Department',
            'category' => 'Computer Hardware', 'priority' => 'High', 'quantity' => 2, 'unitPrice' => '150.25',
        ];
    }
}
