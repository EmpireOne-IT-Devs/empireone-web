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
        Schema::create('e_r_acknowledgement_employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('e_r_acknowledgement_id')
                ->nullable()
                ->constrained('e_r_acknowledgements')
                ->nullOnDelete();
            $table->foreignId('e_r_acknowledgement_item_id')
                ->nullable()
                ->constrained('e_r_acknowledgement_items')
                ->nullOnDelete();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('e_r_acknowledgement_employees');
    }
};
