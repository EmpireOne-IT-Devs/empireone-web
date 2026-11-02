<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('engagement_e_store_point_transactions')) {
            return;
        }

        Schema::create('engagement_e_store_point_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('redemption_id')->constrained('engagement_e_store_redemptions')->restrictOnDelete();
            $table->string('type', 20);
            $table->unsignedBigInteger('points');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['redemption_id', 'type']);
            $table->index(['user_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('engagement_e_store_point_transactions');
    }
};
