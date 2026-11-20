<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('asset_liability_forms', function (Blueprint $table) {
            $table->date('paper_signed_date')->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('users')->restrictOnDelete();
            $table->string('paper_scan_path')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('asset_liability_forms', function (Blueprint $table) {
            $table->dropConstrainedForeignId('recorded_by');
            $table->dropColumn(['paper_signed_date', 'paper_scan_path']);
        });
    }
};
