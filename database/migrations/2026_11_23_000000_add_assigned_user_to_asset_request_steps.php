<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach ([
            'asset_purchase_request_steps' => 'asset_purchase_request_step_assigned_user_foreign',
            'asset_item_request_steps' => 'asset_item_request_step_assigned_user_foreign',
        ] as $tableName => $foreignName) {
            if (! Schema::hasTable($tableName)) {
                continue;
            }
            Schema::table($tableName, function (Blueprint $table) use ($foreignName) {
                $table->foreignId('assigned_user_id')->nullable()->after('status')
                    ->constrained('users')->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        foreach (['asset_purchase_request_steps', 'asset_item_request_steps'] as $tableName) {
            if (! Schema::hasTable($tableName) || ! Schema::hasColumn($tableName, 'assigned_user_id')) {
                continue;
            }
            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                $table->dropForeign(['assigned_user_id']);
                $table->dropColumn('assigned_user_id');
            });
        }
    }
};
