<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('asset_purchase_requests', function (Blueprint $table) {
            $table->string('purchase_request_id')->nullable()->unique();
        });
    }

    public function down(): void
    {
        Schema::table('asset_purchase_requests', function (Blueprint $table) {
            $table->dropUnique(['purchase_request_id']);
            $table->dropColumn('purchase_request_id');
        });
    }
};
