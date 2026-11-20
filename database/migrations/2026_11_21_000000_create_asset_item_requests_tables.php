<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asset_item_requests', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('item_request_id')->unique();
            $table->foreignId('requester_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('assignee_id')->constrained('users')->restrictOnDelete();
            $table->string('requester_name');
            $table->string('requester_email');
            $table->string('assignee_name');
            $table->string('assignee_email');
            $table->string('employee_number');
            $table->string('department')->nullable();
            $table->string('asset_type', 30);
            $table->unsignedBigInteger('asset_id');
            $table->string('asset_tag');
            $table->string('asset_name');
            // NULL releases the hold while allowing multiple historical requests.
            $table->boolean('reservation_active')->nullable();
            $table->unique(['asset_type', 'asset_id', 'reservation_active'], 'asset_item_request_reservation_unique');
            $table->string('request_type')->index();
            $table->string('priority')->index();
            $table->date('from_date')->nullable();
            $table->date('until_date')->nullable();
            $table->text('justification');
            $table->text('purpose')->nullable();
            $table->string('status')->index();
            $table->timestamps();
        });

        Schema::create('asset_item_request_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_request_id')->constrained('asset_item_requests')->cascadeOnDelete();
            $table->string('key', 50);
            $table->unsignedTinyInteger('position');
            $table->string('label');
            $table->string('description');
            $table->string('status', 20)->default('pending');
            $table->foreignId('acted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('approver_name')->nullable();
            $table->timestamp('acted_at')->nullable();
            $table->text('remarks')->nullable();
            $table->unique(['item_request_id', 'position'], 'asset_item_request_step_position_unique');
            $table->unique(['item_request_id', 'key'], 'asset_item_request_step_key_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_item_request_steps');
        Schema::dropIfExists('asset_item_requests');
    }
};
