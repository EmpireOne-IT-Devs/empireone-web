<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('engagement_e_stores')) {
            return;
        }

        Schema::table('engagement_e_stores', function (Blueprint $table) {
            if (! Schema::hasColumn('engagement_e_stores', 'is_active')) {
                $table->boolean('is_active')->default(true)->index()->after('quantity');
            }
            if (! Schema::hasColumn('engagement_e_stores', 'is_unlimited_stock')) {
                $table->boolean('is_unlimited_stock')->default(false)->after('is_active');
            }
            if (! Schema::hasColumn('engagement_e_stores', 'updated_by')) {
                $table->foreignId('updated_by')->nullable()->after('created_by')->constrained('users')->nullOnDelete();
            }
        });

        // Preserve the existing convention: a NULL quantity means unlimited stock.
        DB::table('engagement_e_stores')
            ->whereNull('quantity')
            ->update(['is_unlimited_stock' => true]);
    }

    public function down(): void
    {
        if (! Schema::hasTable('engagement_e_stores')) {
            return;
        }

        Schema::table('engagement_e_stores', function (Blueprint $table) {
            if (Schema::hasColumn('engagement_e_stores', 'updated_by')) {
                $table->dropConstrainedForeignId('updated_by');
            }
            if (Schema::hasColumn('engagement_e_stores', 'is_unlimited_stock')) {
                $table->dropColumn('is_unlimited_stock');
            }
            if (Schema::hasColumn('engagement_e_stores', 'is_active')) {
                $table->dropColumn('is_active');
            }
        });
    }
};
