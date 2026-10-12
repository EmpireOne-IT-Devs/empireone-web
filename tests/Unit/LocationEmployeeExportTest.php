<?php

namespace Tests\Unit;

use App\Models\Department;
use App\Models\Location;
use App\Models\Site;
use App\Models\User;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class LocationEmployeeExportTest extends TestCase
{
    public function createApplication()
    {
        $app = require dirname(__DIR__, 2).'/bootstrap/app.php';
        $this->traitsUsedByTest = array_flip(class_uses_recursive(static::class));

        RouteServiceProvider::loadRoutesUsing(function () {
            Route::middleware('api')->prefix('api')->group(base_path('routes/api.php'));
        });
        $app->make(Kernel::class)->bootstrap();

        return $app;
    }

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'database.default' => 'location_employee_testing',
            'database.connections.location_employee_testing' => [
                'driver' => 'sqlite',
                'database' => ':memory:',
                'prefix' => '',
                'foreign_key_constraints' => true,
            ],
        ]);
        $this->assertSame('sqlite', DB::connection()->getDriverName());

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->unsignedInteger('role')->default(2);
            $table->timestamps();
        });
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('manager_id')->nullable();
            $table->timestamps();
        });
        Schema::create('sites', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('location_id')->nullable();
            $table->string('name');
            $table->timestamps();
        });
        Schema::create('account_employees', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('location_id')->nullable();
            $table->unsignedBigInteger('department_id')->nullable();
            $table->unsignedBigInteger('site_id')->nullable();
            $table->string('employee_id')->nullable();
            $table->string('employment_status')->nullable();
            $table->date('started_at')->nullable();
            $table->timestamps();
        });
        Schema::create('account_personal_information', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('first_name')->nullable();
            $table->string('middle_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('suffix')->nullable();
            $table->timestamps();
        });

        $location = Location::create(['name' => 'San Carlos']);
        $otherLocation = Location::create(['name' => 'Carcar']);
        $department = Department::create(['name' => 'People Operations']);
        $site = Site::create(['name' => 'Main Office', 'location_id' => $location->id]);
        $employee = User::create(['name' => 'Employee One', 'email' => 'employee@example.test', 'role' => 2]);
        $employee->account_employee()->create([
            'location_id' => $location->id,
            'department_id' => $department->id,
            'site_id' => $site->id,
            'employee_id' => 'E-001',
            'employment_status' => 'Active',
            'started_at' => '2024-01-02',
        ]);
        $employee->personal_information()->create([
            'first_name' => '=SUM(1,1)',
            'middle_name' => 'A',
            'last_name' => 'Employee',
        ]);

        $otherEmployee = User::create(['name' => 'Employee Two', 'email' => 'other@example.test', 'role' => 2]);
        $otherEmployee->account_employee()->create([
            'location_id' => $otherLocation->id,
            'employee_id' => 'E-002',
            'employment_status' => 'Active',
        ]);
        $applicant = User::create(['name' => 'Applicant', 'email' => 'applicant@example.test', 'role' => 3]);
        $applicant->account_employee()->create([
            'location_id' => $location->id,
            'employee_id' => 'A-001',
        ]);

        $this->actingAs($employee);
    }

    public function test_counts_include_registered_employees_by_location(): void
    {
        $this->getJson('/api/locations/employee-counts')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Carcar')
            ->assertJsonPath('data.0.employee_count', 1)
            ->assertJsonPath('data.1.name', 'San Carlos')
            ->assertJsonPath('data.1.employee_count', 1);
    }

    public function test_export_contains_only_selected_location_employee_fields_and_safe_csv_values(): void
    {
        $response = $this->get('/api/locations/1/employees/export');
        $this->assertSame(200, $response->getStatusCode());
        $this->assertStringContainsString('text/csv', $response->headers->get('Content-Type'));
        $this->assertStringContainsString('employees-san-carlos-', $response->headers->get('Content-Disposition'));

        ob_start();
        $response->getCallback()();
        $csv = ob_get_clean();

        $this->assertStringContainsString('E-001', $csv);
        $this->assertStringContainsString("'=SUM(1,1)", $csv);
        $this->assertStringContainsString('employee@example.test', $csv);
        $this->assertStringContainsString('People Operations', $csv);
        $this->assertStringNotContainsString('E-002', $csv);
        $this->assertStringNotContainsString('applicant@example.test', $csv);
    }

    public function test_location_employee_endpoints_require_an_employee_account(): void
    {
        auth()->logout();
        $this->getJson('/api/locations/employee-counts')->assertUnauthorized();
        $this->getJson('/api/locations/1/employees/export')->assertUnauthorized();

        $applicant = User::where('email', 'applicant@example.test')->firstOrFail();
        $this->actingAs($applicant);
        $this->getJson('/api/locations/employee-counts')->assertForbidden();
        $this->getJson('/api/locations/1/employees/export')->assertForbidden();
    }
}
