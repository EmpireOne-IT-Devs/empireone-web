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
        Schema::create('e_r_acknowledgement_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('e_r_acknowledgement_id')
                ->nullable()
                ->constrained('e_r_acknowledgements')
                ->nullOnDelete();
            $table->string('title')->nullable();
            $table->longText('file')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('e_r_acknowledgement_items');
    }
};
