<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asset_system_units', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('asset_tag')->unique();
            $table->string('name');
            $table->string('system_type')->index();
            $table->string('cpu');
            $table->string('ram');
            $table->string('storage');
            $table->string('os');
            $table->string('status')->index();
            $table->string('location')->index();
            $table->string('station')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_system_units');
    }
};
