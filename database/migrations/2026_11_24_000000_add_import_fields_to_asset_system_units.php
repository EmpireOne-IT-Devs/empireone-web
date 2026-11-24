<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Imported units come from the inventory sheet, which has no hardware specs or location.
    private const OPTIONAL_COLUMNS = ['cpu', 'ram', 'storage', 'os', 'location'];

    public function up(): void
    {
        Schema::table('asset_system_units', function (Blueprint $table) {
            $table->string('serial_number')->nullable()->unique()->after('asset_tag');
            $table->string('condition')->nullable()->after('status');
            $table->string('nature')->nullable()->after('condition');
            $table->date('purchase_date')->nullable()->after('nature');
            $table->string('account')->nullable()->after('purchase_date');
            $table->timestamp('imported_at')->nullable()->after('station');
        });

        Schema::table('asset_system_units', function (Blueprint $table) {
            foreach (self::OPTIONAL_COLUMNS as $column) {
                $table->string($column)->nullable()->change();
            }
        });
    }

    public function down(): void
    {
        // The columns go back to required, so empty values need a placeholder first.
        foreach (self::OPTIONAL_COLUMNS as $column) {
            DB::table('asset_system_units')->whereNull($column)->update([$column => '']);
        }

        Schema::table('asset_system_units', function (Blueprint $table) {
            foreach (self::OPTIONAL_COLUMNS as $column) {
                $table->string($column)->nullable(false)->change();
            }
        });

        Schema::table('asset_system_units', function (Blueprint $table) {
            $table->dropUnique(['serial_number']);
            $table->dropColumn(['serial_number', 'condition', 'nature', 'purchase_date', 'account', 'imported_at']);
        });
    }
};
