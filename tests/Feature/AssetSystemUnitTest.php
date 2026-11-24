<?php

namespace Tests\Feature;

use App\Models\AssetInventory\AssetSystemUnit;
use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Tests\TestCase;

class AssetSystemUnitTest extends TestCase
{
    private const API = '/api/asset_inventory/system_units';

    private const MIGRATION = 'migrations/2026_11_23_100000_create_asset_system_units_table.php';

    private const IMPORT_FIELDS_MIGRATION = 'migrations/2026_11_24_000000_add_import_fields_to_asset_system_units.php';

    private const IMPORT_API = '/api/asset_inventory/import';

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'database.default' => 'system_unit_testing',
            'database.connections.system_unit_testing' => [
                'driver' => 'sqlite', 'database' => ':memory:', 'foreign_key_constraints' => true,
            ],
        ]);

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->unsignedTinyInteger('role');
            $table->timestamps();
        });
        (require database_path(self::MIGRATION))->up();
        (require database_path(self::IMPORT_FIELDS_MIGRATION))->up();
    }

    public function test_inventory_import_sends_pc_rows_to_system_units_and_treats_none_as_empty(): void
    {
        $this->actingAs($this->user('admin'), 'sanctum');
        $sheetRow = fn (array $values) => [
            'unit' => 'PC', 'asset_tag' => 'None', 'sn' => 'None', 'model' => 'None', 'status' => 'Good',
            'condition' => 'Second Hand', 'nature' => 'None', 'date_purchased' => 'Undetermined', 'remarks' => 'JTV',
            ...$values,
        ];

        $analysis = $this->postJson(self::IMPORT_API.'/analyze', ['rows' => [
            $sheetRow(['asset_tag' => 'EOG001', 'sn' => 'SN-1', 'model' => 'HP', 'condition' => 'Brandnew', 'nature' => 'Dedicated', 'date_purchased' => '45292']),
            $sheetRow(['status' => 'Damage', 'remarks' => 'Stock']),
            $sheetRow(['model' => 'TRENDSONIC', 'remarks' => 'Stock']),
            $sheetRow(['unit' => 'Monitor', 'model' => 'AOC']),
            $sheetRow(['unit' => 'Monitor', 'asset_tag' => 'MON001', 'model' => 'AOC']),
        ]])->assertOk()
            ->assertJsonPath('grouped.system_units', 3)
            ->assertJsonPath('rows.0.status', 'ready')
            ->assertJsonPath('rows.0.payload', [
                'asset_tag' => 'EOG001', 'serial_number' => 'SN-1', 'name' => 'HP', 'system_type' => 'Desktop',
                'status' => 'Assigned', 'condition' => 'Brandnew', 'nature' => 'Dedicated',
                'purchase_date' => '2024-01-01', 'account' => 'JTV',
            ])
            ->assertJsonPath('rows.1.status', 'ready')
            ->assertJsonPath('rows.1.payload.asset_tag', '')
            ->assertJsonPath('rows.1.payload.serial_number', null)
            ->assertJsonPath('rows.1.payload.name', 'PC')
            ->assertJsonPath('rows.1.payload.status', 'Maintenance')
            ->assertJsonPath('rows.1.payload.purchase_date', null)
            ->assertJsonPath('rows.2.payload.status', 'Available')
            // Other modules still need a real asset tag, but a missing serial number is fine.
            ->assertJsonPath('rows.3.module', 'monitors')
            ->assertJsonPath('rows.3.status', 'invalid')
            ->assertJsonPath('rows.3.warnings.0', 'Asset tag is required')
            ->assertJsonPath('rows.4.status', 'ready')
            ->assertJsonPath('rows.4.payload.serial_number', null)
            ->json('rows');

        $units = ['system_units' => ['rows' => array_column(array_slice($analysis, 0, 3), 'payload')]];
        $this->postJson(self::IMPORT_API.'/commit', ['modules' => $units])->assertOk()
            ->assertJsonPath('modules.system_units.imported', 3)
            ->assertJsonPath('modules.system_units.skipped', []);
        $this->assertSame(
            ['EOG001', 'SU-0001', 'SU-0002'],
            AssetSystemUnit::orderBy('asset_tag')->pluck('asset_tag')->all(),
        );

        // A second import skips the row it can recognise by its tag.
        $this->postJson(self::IMPORT_API.'/commit', ['modules' => $units])->assertOk()
            ->assertJsonPath('modules.system_units.skipped.0.reason', 'Duplicate asset tag');
        $this->assertSame(1, AssetSystemUnit::where('asset_tag', 'EOG001')->count());

        $this->getJson(self::API.'?search=SN-1')->assertOk()
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.id', 'EOG001')
            ->assertJsonPath('data.0.serialNumber', 'SN-1')
            ->assertJsonPath('data.0.account', 'JTV')
            ->assertJsonPath('data.0.purchaseDate', '2024-01-01')
            ->assertJsonPath('data.0.condition', 'Brandnew')
            ->assertJsonPath('data.0.cpu', null);
    }

    public function test_generated_tags_skip_imported_tags_that_share_the_prefix(): void
    {
        $this->unit(['asset_tag' => 'SU-LEGACY-ITEM']);
        $this->unit(['asset_tag' => 'SU-0001']);

        $this->assertSame('SU-0002', $this->unit()->asset_tag);
    }

    public function test_only_admins_can_list_or_create_system_units(): void
    {
        $this->getJson(self::API)->assertUnauthorized();
        $this->postJson(self::API, $this->values())->assertUnauthorized();

        $this->actingAs($this->user('employee', User::ROLE_EMPLOYEE), 'sanctum');
        $this->getJson(self::API)->assertForbidden();
        $this->postJson(self::API, $this->values())->assertForbidden();
        $this->assertDatabaseCount('asset_system_units', 0);
    }

    public function test_create_validates_input_and_assigns_sequential_tags_that_are_never_reused(): void
    {
        $this->actingAs($this->user('admin'), 'sanctum');

        $this->postJson(self::API, [])->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'type', 'cpu', 'ram', 'storage', 'os', 'status', 'location']);
        $this->postJson(self::API, [...$this->values(), 'name' => 'A', 'type' => 'Laptop', 'status' => 'Broken'])
            ->assertUnprocessable()->assertJsonValidationErrors(['name', 'type', 'status']);
        $this->assertDatabaseCount('asset_system_units', 0);

        $first = $this->postJson(self::API, [...$this->values(), 'id' => 'SU-9999', 'asset_tag' => 'SU-9999', 'uuid' => 'forged'])
            ->assertCreated()
            ->assertJsonPath('data.id', 'SU-0001')
            ->assertJsonPath('data.name', 'Dell OptiPlex 7010')
            ->assertJsonPath('data.type', 'Desktop')
            ->assertJsonPath('data.status', 'Available')
            ->assertJsonPath('data.station', null)
            ->assertJsonPath('data.customBuilt', false)
            ->json('data');
        $this->assertNotSame('forged', $first['uuid']);
        $this->assertDatabaseHas('asset_system_units', [
            'asset_tag' => 'SU-0001', 'system_type' => 'Desktop', 'cpu' => 'Intel Core i5-13500', 'location' => 'Main office',
        ]);

        $this->postJson(self::API, [...$this->values(), 'name' => 'Custom Build — Ryzen 7', 'station' => 'Station 04'])
            ->assertCreated()->assertJsonPath('data.id', 'SU-0002')
            ->assertJsonPath('data.station', 'Station 04')->assertJsonPath('data.customBuilt', true);

        // A deleted unit keeps its tag, so the next unit moves on to a new number.
        AssetSystemUnit::where('asset_tag', 'SU-0002')->firstOrFail()->delete();
        $this->postJson(self::API, $this->values())->assertCreated()->assertJsonPath('data.id', 'SU-0003');
    }

    public function test_a_tag_taken_by_a_concurrent_save_is_retried_with_the_next_tag(): void
    {
        $this->actingAs($this->user('admin'), 'sanctum');
        $attempts = 0;
        // Boot the model first so its own tag-assigning hook runs before this one.
        new AssetSystemUnit;
        AssetSystemUnit::creating(function (AssetSystemUnit $unit) use (&$attempts) {
            if (++$attempts === 1) {
                // Simulate another request saving the same tag first.
                $unit->replicate()->forceFill(['uuid' => (string) Str::uuid()])->saveQuietly();
            }
        });

        $this->postJson(self::API, $this->values())->assertCreated()->assertJsonPath('data.id', 'SU-0002');

        $this->assertSame(2, $attempts);
        $this->assertSame(['SU-0001', 'SU-0002'], AssetSystemUnit::orderBy('asset_tag')->pluck('asset_tag')->all());
    }

    public function test_list_filters_paginates_and_reports_inventory_wide_stats(): void
    {
        $this->actingAs($this->user('admin'), 'sanctum');
        $this->getJson(self::API)->assertOk()->assertJsonCount(0, 'data')
            ->assertJsonPath('meta.total', 0)->assertJsonPath('stats.total', 0);

        foreach (range(1, 11) as $number) {
            $this->unit(['name' => "Office Desktop {$number}", 'station' => "Station {$number}"]);
        }
        $this->unit(['name' => 'Custom Build Creator', 'system_type' => 'Workstation', 'status' => 'Assigned', 'location' => 'Remote', 'cpu' => 'AMD Ryzen 7']);
        $this->unit(['name' => 'Rack Server', 'system_type' => 'Server', 'status' => 'Maintenance', 'os' => 'Windows Server 2022']);
        $this->unit(['name' => 'Removed Desktop'])->delete();

        $this->getJson(self::API)->assertOk()
            ->assertJsonCount(10, 'data')
            ->assertJsonPath('meta.total', 13)->assertJsonPath('meta.per_page', 10)->assertJsonPath('meta.last_page', 2)
            ->assertJsonPath('data.0.name', 'Rack Server')
            ->assertJsonPath('stats.total', 13)->assertJsonPath('stats.available', 11)
            ->assertJsonPath('stats.assigned', 1)->assertJsonPath('stats.custom', 1);
        $this->getJson(self::API.'?page=2')->assertOk()->assertJsonCount(3, 'data');

        $this->getJson(self::API.'?type=Workstation')->assertOk()
            ->assertJsonPath('meta.total', 1)->assertJsonPath('data.0.name', 'Custom Build Creator')
            ->assertJsonPath('stats.total', 13);
        $this->getJson(self::API.'?status=Maintenance')->assertOk()
            ->assertJsonPath('meta.total', 1)->assertJsonPath('data.0.type', 'Server');
        $this->getJson(self::API.'?location=Remote')->assertOk()->assertJsonPath('meta.total', 1);
        foreach (['ryzen' => 1, 'server 2022' => 1, 'Station 11' => 1, 'SU-0001' => 1, 'removed' => 0] as $search => $total) {
            $this->getJson(self::API.'?search='.urlencode($search))->assertOk()->assertJsonPath('meta.total', $total);
        }
        $this->getJson(self::API.'?status=Available&type=Desktop&search=office')->assertOk()->assertJsonPath('meta.total', 11);

        $this->getJson(self::API.'?type=Laptop&status=Broken&per_page=101&page=0')->assertUnprocessable()
            ->assertJsonValidationErrors(['type', 'status', 'per_page', 'page']);
    }

    public function test_migrations_are_reversible(): void
    {
        $imported = $this->unit(['cpu' => null, 'location' => null, 'serial_number' => 'SN-9']);

        (require database_path(self::IMPORT_FIELDS_MIGRATION))->down();
        $this->assertFalse(Schema::hasColumn('asset_system_units', 'serial_number'));
        $this->assertFalse(Schema::hasColumn('asset_system_units', 'imported_at'));
        // Units imported without specs survive the rollback with an empty placeholder.
        $this->assertSame('', $imported->refresh()->cpu);

        (require database_path(self::MIGRATION))->down();
        $this->assertFalse(Schema::hasTable('asset_system_units'));
    }

    private function unit(array $overrides = []): AssetSystemUnit
    {
        return AssetSystemUnit::create([
            'name' => 'Dell OptiPlex 7010', 'system_type' => 'Desktop', 'cpu' => 'Intel Core i5-13500', 'ram' => '16 GB',
            'storage' => '512 GB SSD', 'os' => 'Windows 11 Pro', 'status' => 'Available', 'location' => 'Main office',
            ...$overrides,
        ]);
    }

    private function user(string $name, int $role = User::ROLE_ADMIN): User
    {
        $user = new User([
            'name' => ucfirst($name), 'email' => $name.'@example.test', 'role' => $role, 'password' => 'password',
        ]);
        $user->forceFill(['email_verified_at' => now()])->save();

        return $user;
    }

    private function values(): array
    {
        return [
            'name' => 'Dell OptiPlex 7010', 'type' => 'Desktop', 'cpu' => 'Intel Core i5-13500', 'ram' => '16 GB',
            'storage' => '512 GB SSD', 'os' => 'Windows 11 Pro', 'status' => 'Available', 'location' => 'Main office',
        ];
    }
}
