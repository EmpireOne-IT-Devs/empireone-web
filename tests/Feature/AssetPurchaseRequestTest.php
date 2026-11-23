<?php

namespace Tests\Feature;

use App\Jobs\SendAssetPurchaseRequestEmail;
use App\Models\AssetInventory\AssetPurchaseRequest;
use App\Models\User;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Database\QueryException;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Mockery;
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
        (require database_path('migrations/2026_11_19_220000_add_purchase_request_identifiers.php'))->up();
        (require database_path('migrations/2026_11_20_000000_add_justification_to_asset_purchase_requests.php'))->up();
        (require database_path('migrations/2026_11_20_005200_add_items_to_asset_purchase_requests.php'))->up();
        Schema::create('account_employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('eogs_email')->nullable();
        });
        // The employee profile relation also loads these; they stay empty here.
        foreach (['accounts', 'sites', 'departments', 'e_r_leaders'] as $tableName) {
            Schema::create($tableName, fn (Blueprint $table) => $table->id());
        }
        (require database_path('migrations/2026_11_23_000000_add_assigned_user_to_asset_request_steps.php'))->up();
    }

    public function test_new_request_identifiers_reset_monthly_and_existing_identifiers_are_unchanged(): void
    {
        $this->travelTo(now()->setDate(2026, 11, 19)->startOfDay());
        $this->actingAs($this->account('owner'), 'sanctum');
        $legacy = $this->postJson(self::API, $this->values())->assertCreated()->json('data');
        DB::table('asset_purchase_requests')->where('uuid', $legacy['uuid'])->update(['purchase_request_id' => null]);

        $first = $this->postJson(self::API, $this->values())->assertCreated()->json('data');
        $this->assertSame('PR-202611-0001', $first['id']);
        $second = $this->postJson(self::API, $this->values())->assertCreated()->json('data');
        $this->assertSame('PR-202611-0002', $second['id']);
        $this->getJson(self::API.'/'.$legacy['uuid'])->assertOk()->assertJsonPath('data.id', 'PR-001');
        $this->getJson(self::API.'?search=PR-001')->assertOk()
            ->assertJsonPath('meta.total', 1)->assertJsonPath('data.0.uuid', $legacy['uuid']);
        $this->getJson(self::API.'?search=PR-002')->assertOk()->assertJsonPath('meta.total', 0);
        $this->getJson(self::API.'?search=PR-202611-0001')->assertOk()
            ->assertJsonPath('meta.total', 1)->assertJsonPath('data.0.uuid', $first['uuid']);

        $this->account('reviewer');
        Queue::pushed(SendAssetPurchaseRequestEmail::class)->first()->handle();
        $message = Mail::mailer()->getSymfonyTransport()->messages()->first()->getOriginalMessage();
        $this->assertStringContainsString('PR-001', $message->getSubject());

        $this->travelTo(now()->setDate(2026, 12, 1));
        $december = $this->postJson(self::API, $this->values())->assertCreated()
            ->assertJsonPath('data.id', 'PR-202612-0001')->json('data.uuid');
        DB::table('asset_purchase_requests')->where('uuid', $december)->update(['purchase_request_id' => 'PR-202612-9999']);
        $this->postJson(self::API, $this->values())->assertCreated()->assertJsonPath('data.id', 'PR-202612-10000');
        $this->postJson(self::API, $this->values())->assertCreated()->assertJsonPath('data.id', 'PR-202612-10001');

        $this->expectException(QueryException::class);
        DB::table('asset_purchase_requests')->where('uuid', $second['uuid'])
            ->update(['purchase_request_id' => $first['id']]);
    }

    public function test_identifier_migration_is_reversible(): void
    {
        $migration = require database_path('migrations/2026_11_19_220000_add_purchase_request_identifiers.php');
        $migration->down();

        $this->assertFalse(Schema::hasColumn('asset_purchase_requests', 'purchase_request_id'));
        $this->assertTrue(Schema::hasTable('asset_purchase_requests'));
    }

    public function test_a_duplicate_identifier_is_retried_instead_of_failing_the_request(): void
    {
        $this->actingAs($this->account('owner'), 'sanctum');
        $attempts = 0;
        AssetPurchaseRequest::creating(function (AssetPurchaseRequest $request) use (&$attempts) {
            if (++$attempts === 1) {
                // Simulate another request saving the same number first.
                $request->replicate()->forceFill(['uuid' => (string) Str::uuid()])->saveQuietly();
            }
        });

        $this->postJson(self::API, $this->values())->assertCreated()
            ->assertJsonPath('data.id', 'PR-'.now()->format('Ym').'-0001');

        $this->assertSame(2, $attempts);
        $this->assertSame(1, DB::table('asset_purchase_requests')->count());
        $this->assertSame(3, DB::table('asset_purchase_request_steps')->count());
        Queue::assertPushed(SendAssetPurchaseRequestEmail::class, 1);
    }

    public function test_identifier_uses_the_creation_month_after_a_slow_quotation_upload(): void
    {
        $this->travelTo(now()->setDate(2026, 11, 30)->setTime(23, 59, 59));
        $disk = Mockery::mock(Filesystem::class);
        $disk->shouldReceive('putFileAs')->once()->andReturnUsing(function () {
            $this->travelTo(now()->addSeconds(2));

            return 'purchase-requests/test/quotation.pdf';
        });
        Storage::shouldReceive('disk')->once()->with('purchase_quotations')->andReturn($disk);

        $this->actingAs($this->account('owner'), 'sanctum');
        $created = $this->post(self::API, $this->values() + [
            'supplierQuotation' => UploadedFile::fake()->createWithContent('quote.pdf', "%PDF-1.4\n%%EOF"),
        ], ['Accept' => 'application/json'])->assertCreated()->json('data');

        $this->assertSame('PR-202612-0001', $created['id']);
        $this->assertSame('2026-12-01', $created['requestDate']);
    }

    public function test_identifier_and_creation_date_match_if_month_changes_during_allocation(): void
    {
        $this->travelTo(now()->setDate(2026, 11, 30)->setTime(23, 59, 59));
        $this->actingAs($this->account('owner'), 'sanctum');
        $advanced = false;
        DB::listen(function ($query) use (&$advanced) {
            if (! $advanced && str_contains($query->sql, 'LENGTH(purchase_request_id)')) {
                $advanced = true;
                $this->travelTo(now()->addSeconds(2));
            }
        });

        $created = $this->postJson(self::API, $this->values())->assertCreated()->json('data');

        $this->assertTrue($advanced);
        $this->assertSame('PR-202611-0001', $created['id']);
        $this->assertSame('2026-11-30', $created['requestDate']);
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
            'requesterName' => 'Forged name', 'requesterEmail' => 'forged@example.test', 'status' => 'Approved',
        ])->assertCreated()
            ->assertJsonPath('data.totalAmount', 300.5)
            ->assertJsonPath('data.requesterName', 'owner@example.test')
            ->assertJsonPath('data.requesterEmail', 'owner@example.test')
            ->assertJsonPath('data.status', 'Pending Approval')
            ->assertJsonPath('data.canAct', false)
            ->assertJsonCount(3, 'data.approvals')
            ->json('data');

        $this->getJson(self::API.'?search='.$saved['id'])->assertOk()
            ->assertJsonPath('data.0.uuid', $saved['uuid'])->assertJsonPath('meta.per_page', 10);
        $this->getJson(self::API.'/'.$saved['uuid'])->assertOk()
            ->assertJsonPath('data.itemName', 'Monitor')
            ->assertJsonPath('data.justification', $this->values()['justification']);
        $this->postJson(self::API.'/'.$saved['uuid'].'/approve', ['step' => 'department_head'])->assertForbidden();

        $this->actingAs($this->account('other'), 'sanctum');
        $this->getJson(self::API.'?search=Monitor')->assertOk()->assertJsonPath('meta.total', 0);
        $this->getJson(self::API.'/'.$saved['uuid'])->assertForbidden();

        $this->actingAs($this->account('reviewer'), 'sanctum');
        $this->getJson(self::API.'?priority=High')->assertOk()->assertJsonPath('meta.total', 1);
        $this->getJson(self::API.'/'.$saved['uuid'])->assertOk()->assertJsonPath('data.canAct', true);
    }

    public function test_new_requests_require_a_nonblank_justification_of_at_most_1000_characters(): void
    {
        $this->actingAs($this->account('owner'), 'sanctum');

        foreach ([null, '   ', str_repeat('a', 1001)] as $justification) {
            $this->postJson(self::API, [...$this->values(), 'justification' => $justification])
                ->assertUnprocessable()->assertJsonValidationErrors('justification');
        }

        $this->assertDatabaseCount('asset_purchase_requests', 0);
        Queue::assertNothingPushed();
    }

    public function test_multiple_items_are_saved_and_displayed_with_exact_totals_in_details_and_email(): void
    {
        $disk = Storage::fake('purchase_quotations');
        $this->account('reviewer');
        $this->actingAs($this->account('owner'), 'sanctum');
        $items = [
            ['description' => 'Monitor & stand', 'quantity' => '3', 'unitCost' => '1000.19'],
            ['unit' => 'Box', 'description' => 'Cable pack', 'quantity' => '2', 'unitCost' => '0.27'],
        ];
        $values = array_diff_key($this->values(), array_flip(['itemName', 'quantity', 'unitPrice']));
        $saved = $this->post(self::API, [
            ...$values,
            'items' => $items,
            'grandTotal' => 1,
            'supplierQuotation' => UploadedFile::fake()->createWithContent('quote.pdf', "%PDF-1.4\n%%EOF"),
        ], ['Accept' => 'application/json'])
            ->assertCreated()->assertJsonPath('data.grandTotal', '3001.11')->json('data');
        $disk->assertExists('purchase-requests/'.$saved['uuid'].'/quotation.pdf');
        $request = AssetPurchaseRequest::where('uuid', $saved['uuid'])->firstOrFail();
        $this->assertArrayNotHasKey('unit', $request->items[0]);
        $this->assertArrayNotHasKey('unit', $request->items[1]);
        $storedItems = $request->items;
        $storedItems[1]['unit'] = 'Box';
        $request->update(['items' => $storedItems]);
        $this->getJson(self::API.'/'.$saved['uuid'])->assertOk()
            ->assertJsonCount(2, 'data.items')
            ->assertJsonPath('data.items.0.lineTotal', '3000.57')
            ->assertJsonMissingPath('data.items.1.unit')
            ->assertJsonPath('data.items.1.description', 'Cable pack')
            ->assertJsonPath('data.items.1.quantity', 2)
            ->assertJsonPath('data.items.1.unitCost', '0.27')
            ->assertJsonPath('data.items.1.lineTotal', '0.54')
            ->assertJsonPath('data.grandTotal', '3001.11');

        Queue::pushed(SendAssetPurchaseRequestEmail::class)->first()->handle();
        $message = Mail::mailer()->getSymfonyTransport()->messages()->first()->getOriginalMessage();
        $html = $message->getHtmlBody();
        $this->assertStringContainsString('Requested Items', $html);
        foreach (['Item Name', 'Quantity', 'Unit Cost', 'Total Cost'] as $heading) {
            $this->assertMatchesRegularExpression('/<th scope="col"[^>]*>'.$heading.'<\/th>/', $html);
        }
        foreach ([
            ['Monitor & stand', '3', 'PHP 1,000.19', 'PHP 3,000.57'],
            ['Cable pack', '2', 'PHP 0.27', 'PHP 0.54'],
        ] as [$name, $quantity, $unitCost, $lineTotal]) {
            $this->assertStringContainsString("{$name} ({$quantity} x {$unitCost} = {$lineTotal})", $message->getTextBody());
            $this->assertMatchesRegularExpression(
                '/<th scope="row"[^>]*>'.preg_quote(e($name), '/').'<\/th>\s*<td[^>]*>'.$quantity.'<\/td>\s*<td[^>]*>'.preg_quote($unitCost, '/').'<\/td>\s*<td[^>]*>'.preg_quote($lineTotal, '/').'<\/td>/',
                $html,
            );
        }
        $this->assertStringContainsString('Grand total: PHP 3,001.11', $message->getTextBody());
        $this->assertMatchesRegularExpression('/Grand Total<\/th>\s*<td[^>]*>PHP 3,001\.11<\/td>/', $html);
    }

    public function test_invalid_items_are_rejected_even_when_legacy_fields_are_present(): void
    {
        $this->actingAs($this->account('owner'), 'sanctum');
        $item = ['description' => 'Monitor', 'quantity' => 1, 'unitCost' => '10.00'];

        $this->postJson(self::API, [...$this->values(), 'items' => [[
            'description' => ' ', 'quantity' => 0, 'unitCost' => '0.001',
        ]]])->assertUnprocessable()->assertJsonValidationErrors([
            'items.0.description', 'items.0.quantity', 'items.0.unitCost',
        ]);
        foreach (['', [], array_fill(0, 26, $item)] as $items) {
            $this->postJson(self::API, [...$this->values(), 'items' => $items])
                ->assertUnprocessable()->assertJsonValidationErrors('items');
        }

        $this->assertDatabaseCount('asset_purchase_requests', 0);
        Queue::assertNothingPushed();
    }

    public function test_decisions_require_the_current_step_and_record_the_approver_and_remarks(): void
    {
        $reviewer = $this->account('reviewer');
        $this->actingAs($reviewer, 'sanctum');
        $path = self::API.'/'.$this->postJson(self::API, $this->values())->assertCreated()->json('data.uuid');

        // The second approver cannot act until the first approver has approved.
        $this->actingAs($this->account('step-two'), 'sanctum');
        $this->postJson($path.'/approve', ['step' => 'finance'])->assertConflict();
        $this->postJson($path.'/approve', ['step' => 'department_head'])->assertForbidden();
        $this->assertSame(3, DB::table('asset_purchase_request_steps')->where('status', 'pending')->count());

        $this->actingAs($reviewer, 'sanctum');
        $this->postJson($path.'/approve', ['step' => 'finance'])->assertConflict();
        $this->postJson($path.'/reject', ['step' => 'department_head', 'remarks' => '   '])
            ->assertUnprocessable()->assertJsonValidationErrors('remarks');
        $this->postJson($path.'/approve', ['step' => 'department_head', 'remarks' => 'Reviewed.'])->assertOk()
            ->assertJsonPath('data.status', 'In Progress')->assertJsonPath('data.approvals.0.approverName', 'Reviewer')
            ->assertJsonPath('data.approvals.0.remarks', 'Reviewed.');
        $this->postJson($path.'/approve', ['step' => 'department_head'])->assertConflict();
        foreach (['finance' => 'step-two', 'general_manager' => 'step-three'] as $step => $approver) {
            // The previous approver cannot decide the next approver's step.
            $this->postJson($path.'/approve', ['step' => $step])->assertForbidden();
            $this->actingAs($this->account($approver), 'sanctum');
            $this->postJson($path.'/approve', ['step' => $step])->assertOk();
        }
        $this->getJson($path)->assertOk()->assertJsonPath('data.status', 'Approved')->assertJsonPath('data.canAct', false);

        $this->actingAs($reviewer, 'sanctum');
        $second = self::API.'/'.$this->postJson(self::API, $this->values())->assertCreated()->json('data.uuid');
        $this->postJson($second.'/reject', ['step' => 'department_head', 'remarks' => 'Not needed.'])->assertOk()
            ->assertJsonPath('data.status', 'Rejected')->assertJsonPath('data.canAct', false);
        $this->postJson($second.'/approve', ['step' => 'finance'])->assertConflict();
    }

    public function test_selected_approvers_must_be_verified_admins_with_usable_eogs_email(): void
    {
        $owner = $this->account('owner');
        $eligible = $this->account('eligible');
        DB::table('account_employees')->insert(['user_id' => $eligible->id, 'eogs_email' => 'eligible.eogs@example.test']);
        $employee = $this->account('employee', User::ROLE_EMPLOYEE);
        $unverified = $this->account('unverified');
        $unverified->forceFill(['email_verified_at' => null])->save();
        DB::table('account_employees')->insert(['user_id' => $unverified->id, 'eogs_email' => 'unverified.eogs@example.test']);
        $missingEogs = $this->account('missing-eogs');

        $this->actingAs($owner, 'sanctum');
        foreach ([$employee, $unverified, $missingEogs] as $ineligible) {
            $this->postJson(self::API, [...$this->values(), 'approverIds' => [$eligible->id, $ineligible->id, $eligible->id]])
                ->assertUnprocessable()->assertJsonValidationErrors('approverIds');
        }
        $this->assertDatabaseCount('asset_purchase_requests', 0);
    }

    public function test_the_same_approver_can_hold_every_step_and_must_still_approve_in_order(): void
    {
        $approver = $this->account('reviewer');
        $values = $this->values();
        $values['approverIds'] = [$approver->id, $approver->id, $approver->id];
        $this->actingAs($this->account('owner'), 'sanctum');
        $path = self::API.'/'.$this->postJson(self::API, $values)->assertCreated()
            ->assertJsonCount(3, 'data.approvals')->json('data.uuid');
        $this->assertSame(3, DB::table('asset_purchase_request_steps')->where('assigned_user_id', $approver->id)->count());

        $this->actingAs($approver, 'sanctum');
        $this->postJson($path.'/approve', ['step' => 'general_manager'])->assertConflict();
        foreach (['department_head', 'finance', 'general_manager'] as $step) {
            // Each step sends its own notice once it becomes current.
            Queue::pushed(SendAssetPurchaseRequestEmail::class)->last()->handle();
            $this->postJson($path.'/approve', ['step' => $step])->assertOk();
        }
        $this->getJson($path)->assertOk()->assertJsonPath('data.status', 'Approved');

        $recipients = Mail::mailer()->getSymfonyTransport()->messages()
            ->map(fn ($message) => $message->getOriginalMessage()->getTo()[0]->getAddress())->all();
        $this->assertSame(array_fill(0, 3, 'reviewer.eogs@example.test'), $recipients);
    }

    public function test_legacy_unassigned_purchase_steps_fall_back_to_env_authorization(): void
    {
        $owner = $this->account('owner');
        $legacyReviewer = $this->account('legacy-reviewer');
        config(['purchase_request.steps.department_head.email' => $legacyReviewer->email]);

        $this->actingAs($owner, 'sanctum');
        $uuid = $this->postJson(self::API, $this->values())->assertCreated()->json('data.uuid');
        DB::table('asset_purchase_request_steps')->where('purchase_request_id', function ($query) use ($uuid) {
            $query->select('id')->from('asset_purchase_requests')->where('uuid', $uuid);
        })->update(['assigned_user_id' => null]);

        $this->actingAs($legacyReviewer, 'sanctum');
        $this->postJson(self::API.'/'.$uuid.'/approve', ['step' => 'department_head'])->assertOk();
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
        $reviewers = [
            $keys[0] => $this->account('reviewer'),
            $keys[1] => $this->account('step-two'),
            $keys[2] => $this->account('step-three'),
        ];
        // values() assigns default EOGS addresses, so set the per-step ones afterwards.
        $values = $this->values();
        foreach ($reviewers as $index => $reviewer) {
            DB::table('account_employees')->updateOrInsert(
                ['user_id' => $reviewer->id],
                ['eogs_email' => str_replace(' ', '-', strtolower($index)).'.eogs@example.test'],
            );
        }
        $owner = $this->account('owner');
        DB::table('account_employees')->updateOrInsert(
            ['user_id' => $owner->id],
            ['eogs_email' => 'owner.eogs@example.test'],
        );
        $this->actingAs($owner, 'sanctum');
        $values['approverIds'] = array_map(fn ($key) => $reviewers[$key]->id, $keys);
        $created = $this->postJson(self::API, [
            ...$values,
            'itemName' => 'Monitor & stand',
            'unitPrice' => '750.25',
        ])->assertCreated()->json('data');
        $uuid = $created['uuid'];
        $path = self::API.'/'.$uuid.'/approve';
        $expectedRecipients = [];

        foreach ($keys as $index => $key) {
            Queue::assertPushed(SendAssetPurchaseRequestEmail::class, $index + 1);
            Queue::pushed(SendAssetPurchaseRequestEmail::class)->last()->handle();
            $expectedRecipients[] = str_replace(' ', '-', strtolower($key)).'.eogs@example.test';

            $this->actingAs($reviewers[$key], 'sanctum');
            if ($index > 0) {
                $this->postJson($path, ['step' => $keys[0]])->assertConflict();
            }
            $this->postJson($path, ['step' => $key])->assertOk();
            $this->postJson($path, ['step' => $key])->assertConflict();
        }
        Queue::assertPushed(SendAssetPurchaseRequestEmail::class, count($keys) + 1);
        Queue::pushed(SendAssetPurchaseRequestEmail::class)->last()->handle();
        $expectedRecipients[] = 'owner.eogs@example.test';
        // A delayed email for an already-approved step no longer needs to be sent.
        Queue::pushed(SendAssetPurchaseRequestEmail::class)->first()->handle();

        $messages = Mail::mailer()->getSymfonyTransport()->messages()->map->getOriginalMessage();
        $this->assertSame($expectedRecipients, $messages->map(fn ($message) => $message->getTo()[0]->getAddress())->all());
        $this->assertStringContainsString('completed all approval steps', $messages->last()->getTextBody());
        $this->assertStringContainsString('Department Head', $messages->first()->getHtmlBody());
        $this->assertStringContainsString('completed all approval steps', $messages->last()->getHtmlBody());
        $url = route('asset-purchase-requests.page.show', ['id' => $uuid]);
        foreach ($messages as $message) {
            foreach (['Requester' => 'Owner', 'Priority' => 'High'] as $label => $value) {
                $this->assertStringContainsString("{$label}: {$value}", $message->getTextBody());
                $this->assertMatchesRegularExpression(
                    '/<(th|td)\b[^>]*>\s*'.preg_quote($label, '/').'\s*<\/\1>\s*<td\b[^>]*>\s*'.preg_quote(e($value), '/').'\s*<\/td>/',
                    $message->getHtmlBody(),
                );
            }
            $this->assertStringContainsString('Monitor & stand (2 x PHP 750.25 = PHP 1,500.50)', $message->getTextBody());
            $this->assertStringContainsString('Grand total: PHP 1,500.50', $message->getTextBody());
            $this->assertMatchesRegularExpression('/<th scope="row"[^>]*>Monitor &amp; stand<\/th>\s*<td[^>]*>2<\/td>\s*<td[^>]*>PHP 750\.25<\/td>\s*<td[^>]*>PHP 1,500\.50<\/td>/', $message->getHtmlBody());
            $this->assertMatchesRegularExpression('/Grand Total<\/th>\s*<td[^>]*>PHP 1,500\.50<\/td>/', $message->getHtmlBody());
            $this->assertStringContainsString($created['id'], $message->getSubject());
            $this->assertStringContainsString($created['id'], $message->getTextBody());
            $this->assertStringContainsString('/accounts/administrator/asset_inventory/purchase_request/'.$uuid, $message->getTextBody());
            $this->assertMatchesRegularExpression(
                '/<a\b[^>]*\bhref="'.preg_quote(e($url), '/').'"[^>]*>\s*View Purchase Request[^<]*<\/a>/',
                $message->getHtmlBody(),
            );
            $this->assertSame([], $message->getAttachments());
        }
    }

    public function test_rejection_notifies_only_the_owner_and_rolled_back_requests_do_not_queue_mail(): void
    {
        $owner = $this->account('owner');
        DB::table('account_employees')->updateOrInsert(
            ['user_id' => $owner->id],
            ['eogs_email' => 'owner.eogs@example.test'],
        );
        $this->actingAs($owner, 'sanctum');
        DB::beginTransaction();
        try {
            $this->postJson(self::API, $this->values())->assertCreated();
            Queue::assertNothingPushed();
        } finally {
            DB::rollBack();
        }
        Queue::assertNothingPushed();

        $created = $this->postJson(self::API, $this->values())->assertCreated()->json('data');
        $this->assertSame('PR-'.now()->format('Ym').'-0001', $created['id']);
        $uuid = $created['uuid'];
        $this->actingAs($this->account('reviewer'), 'sanctum');
        $this->postJson(self::API.'/'.$uuid.'/reject', ['step' => 'department_head', 'remarks' => 'Not needed.'])->assertOk();
        Queue::assertPushed(SendAssetPurchaseRequestEmail::class, 2);
        foreach (Queue::pushed(SendAssetPurchaseRequestEmail::class) as $job) {
            $job->handle();
        }

        $messages = Mail::mailer()->getSymfonyTransport()->messages();
        $this->assertCount(1, $messages);
        $message = $messages->first()->getOriginalMessage();
        $this->assertSame('owner.eogs@example.test', $message->getTo()[0]->getAddress());
        $this->assertStringContainsString('was rejected', $message->getTextBody());
        $this->assertStringNotContainsString('Not needed.', $message->getTextBody());
        $this->assertStringContainsString('was rejected', $message->getHtmlBody());
        $this->assertStringNotContainsString('Not needed.', $message->getHtmlBody());
    }

    private function account(string $name, int $role = User::ROLE_ADMIN): User
    {
        $email = $name.'@example.test';
        $existing = User::where('email', $email)->first();
        if ($existing) return $existing;
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
        $approverIds = [];
        foreach (['reviewer', 'step-two', 'step-three'] as $name) {
            $approver = $this->account($name);
            DB::table('account_employees')->updateOrInsert(
                ['user_id' => $approver->id],
                ['eogs_email' => $name === 'reviewer'
                    ? 'reviewer.eogs@example.test' : $name.'.eogs@example.test'],
            );
            $approverIds[] = $approver->id;
        }
        return [
            'itemName' => 'Monitor', 'department' => 'IT Department',
            'category' => 'Computer Hardware', 'priority' => 'High', 'quantity' => 2, 'unitPrice' => '150.25',
            'justification' => "Replace damaged monitors.\nBoth are needed for the support team.",
            'approverIds' => $approverIds,
        ];
    }
}
