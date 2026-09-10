<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->foreignId('holiday_id')->nullable()->after('remarks')->constrained('holidays')->nullOnDelete();
            $table->string('holiday_name')->nullable()->after('holiday_id');
            $table->boolean('is_regular_holiday')->default(false)->after('holiday_name');
            $table->boolean('is_special_holiday')->default(false)->after('is_regular_holiday');
            $table->integer('regular_holiday_mins')->default(0)->after('is_special_holiday');
            $table->integer('special_holiday_mins')->default(0)->after('regular_holiday_mins');
        });
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropConstrainedForeignId('holiday_id');
            $table->dropColumn([
                'holiday_name',
                'is_regular_holiday',
                'is_special_holiday',
                'regular_holiday_mins',
                'special_holiday_mins',
            ]);
        });
    }
};
