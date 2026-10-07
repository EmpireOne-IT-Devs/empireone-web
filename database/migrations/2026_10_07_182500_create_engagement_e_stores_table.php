<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('engagement_e_stores', function (Blueprint $table) {
            $table->id();
            $table->string('product_image', 2048)->nullable();
            $table->string('product_name');
            $table->text('customer_description')->nullable();
            $table->string('reward_type', 100);
            $table->unsignedInteger('point_cost');
            $table->unsignedInteger('quantity')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('engagement_e_stores');
    }
};
