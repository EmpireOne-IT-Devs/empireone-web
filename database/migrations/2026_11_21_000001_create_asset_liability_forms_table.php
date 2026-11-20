<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asset_liability_forms', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('item_request_id')->nullable()->unique()->constrained('asset_item_requests')->restrictOnDelete();
            $table->foreignId('assignee_id')->constrained('users')->restrictOnDelete();
            $table->string('employee_name');
            $table->string('employee_number')->index();
            $table->string('asset_tag')->index();
            $table->string('source', 20)->index();
            $table->string('status', 30)->index();
            $table->string('template_version', 40);
            $table->json('document');
            $table->date('issue_date')->nullable();
            $table->foreignId('acknowledged_by')->nullable()->constrained('users')->restrictOnDelete();
            $table->string('printed_name')->nullable();
            $table->longText('signature')->nullable();
            $table->timestamp('acknowledged_at')->nullable();
            $table->foreignId('voided_by')->nullable()->constrained('users')->restrictOnDelete();
            $table->timestamp('voided_at')->nullable();
            $table->text('void_reason')->nullable();
            $table->timestamp('email_sent_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_liability_forms');
    }
};
