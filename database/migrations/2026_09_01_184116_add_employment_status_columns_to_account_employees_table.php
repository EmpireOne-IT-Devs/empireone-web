<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('account_employees', function (Blueprint $table) {
            $table->enum('is_rehire', [
                'Yes',
                'No',
            ])->nullable()->after('allowance');
            $table->enum('reason_for_separation', [
                'Resignation - Personal',
                'Resignation - Better Opportunity',
                'Resignation - Career Change',
                'Resignation - Medical',
                'Resignation - Education',
                'Resignation - Relocation',
                'Resignation - Compensation',
                'Resignation - Management',
                'Resignation - Culture',
                'Resignation - Schedule',
                'Resignation - Job Misfit',
                'Termination - Attendance',
                'Termination - Behavior',
                'Termination - Performance',
                'Termination - Company Policy Violation',
                'Termination - Training Fall-Out (Language Training)',
                'Termination - Training Fall-Out (Process Training)',
                'Termination - Training Fall-Out (On-The-Job Training)',
                'Termination - Non-Regularization',
                'Termination - Absconding/ AWOL',
                'Redundancy',
                'End of Contract (Fixed Term)',
            ])->nullable()->after('is_rehire');
            $table->enum('employment_status', [
                'Terminated',
                'Resigned',
                'EOPE',
                'AWOL',
                'End of Contrac',
                'Trainee Fallout',
            ])->nullable()->after('reason_for_separation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('account_employees', function (Blueprint $table) {
            $table->dropColumn(['is_rehire', 'reason_for_separation', 'employment_status']);
        });
    }
};
