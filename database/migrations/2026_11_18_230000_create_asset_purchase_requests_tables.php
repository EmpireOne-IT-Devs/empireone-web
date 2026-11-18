<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asset_purchase_requests', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('requester_id')->constrained('users')->restrictOnDelete();
            $table->string('requester_name');
            $table->string('requester_email');
            $table->string('item_name');
            $table->string('department')->index();
            $table->string('department_code');
            $table->string('category')->index();
            $table->string('priority')->index();
            $table->unsignedInteger('quantity');
            $table->decimal('unit_price', 12, 2);
            $table->string('supplier')->nullable();
            $table->date('purchase_date');
            $table->string('status')->default('Pending Approval')->index();
            $table->string('quotation_path')->nullable();
            $table->string('quotation_name')->nullable();
            $table->timestamps();
            $table->index(['requester_id', 'id']);
        });

        Schema::create('asset_purchase_request_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_request_id')->constrained('asset_purchase_requests')->cascadeOnDelete();
            $table->string('key', 50);
            $table->unsignedTinyInteger('position');
            $table->string('label');
            $table->string('description');
            $table->string('status', 20)->default('pending');
            $table->foreignId('acted_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('approver_name')->nullable();
            $table->timestamp('acted_at')->nullable();
            $table->text('remarks')->nullable();
            $table->unique(['purchase_request_id', 'position'], 'asset_purchase_step_position_unique');
            $table->unique(['purchase_request_id', 'key'], 'asset_purchase_step_key_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_purchase_request_steps');
        Schema::dropIfExists('asset_purchase_requests');
    }
};
