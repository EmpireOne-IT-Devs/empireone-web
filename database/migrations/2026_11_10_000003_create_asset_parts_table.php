<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asset_parts', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('asset_tag')->unique();
            $table->string('serial_number')->nullable()->unique();
            $table->string('name');
            $table->string('brand')->nullable();
            $table->string('part_type')->index();
            $table->unsignedInteger('quantity')->default(1);
            $table->unsignedInteger('low_stock_threshold')->default(0);
            $table->string('status')->index();
            $table->string('condition')->nullable();
            $table->string('nature')->nullable();
            $table->decimal('price', 12, 2)->nullable();
            $table->date('purchase_date')->nullable();
            $table->string('account')->nullable();
            $table->string('location')->nullable();
            $table->string('site')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('imported_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_parts');
    }
};
