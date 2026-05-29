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
        Schema::create('e_r_subordinates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('er_leader_id')
                ->nullable()
                ->constrained('e_r_leaders')
                ->nullOnDelete();
            $table->foreignId('subordinate_id')
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
        Schema::dropIfExists('e_r_subordinates');
    }
};
