<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('engagement_e_store_redemption_histories')) {
            return;
        }

        Schema::create('engagement_e_store_redemption_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('redemption_id')->constrained('engagement_e_store_redemptions')->cascadeOnDelete();
            $table->string('from_status', 20)->nullable();
            $table->string('to_status', 20);
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('redemption_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('engagement_e_store_redemption_histories');
    }
};
