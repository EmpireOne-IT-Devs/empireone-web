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
        Schema::create('e_r_employee_change_forms', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id')->nullable();
            $table->foreignId('prepaired_by_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->string('hire_date')->nullable();
            $table->string('effective_date')->nullable();
            $table->string('position_level')->default('N/A');
            $table->string('position')->nullable();
            $table->string('department')->nullable();
            $table->string('account')->nullable();
            $table->string('reporting_to')->nullable();
            $table->text('reason_for_change')->nullable();



            // "From" Information
            $table->string('info_position_level_from')->default('N/A');
            $table->string('info_department_from')->nullable();
            $table->string('info_account_from')->nullable();
            $table->string('info_status_from')->nullable();
            $table->string('info_position_from')->nullable();
            $table->decimal('info_basic_pay_from', 12, 2)->nullable();
            $table->decimal('info_basic_pay_to', 12, 2)->nullable();
            $table->decimal('info_allowances_from', 12, 2)->nullable();
            $table->decimal('info_allowances_to', 12, 2)->nullable();

            // "To" Information
            $table->string('info_position_level_to')->default('N/A');
            $table->unsignedBigInteger('info_department_id_to')->nullable();
            $table->unsignedBigInteger('info_department_id_from')->nullable();
            $table->unsignedBigInteger('info_account_id_to')->nullable();
            $table->unsignedBigInteger('info_account_id_from')->nullable();
            $table->unsignedBigInteger('info_reporting_id_from')->nullable();
            $table->unsignedBigInteger('info_reporting_id_to')->nullable();
            $table->string('info_status_to')->nullable();
            $table->string('info_position_to')->nullable();
            $table->string('info_reporting_to')->nullable();
            $table->string('info_reporting_from')->nullable();

            // checkbox

            $table->boolean('regular')->nullable();
            $table->boolean('account_transfer')->nullable();
            $table->boolean('department_transfer')->nullable();
            $table->boolean('position_and_title')->nullable();
            $table->boolean('tiering')->nullable();

            $table->enum('status', [
                'Pending',
                'Accepted',
                'Declined',
                'Cancelled',
            ])->default('Pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('e_r_employee_change_forms');
    }
};
