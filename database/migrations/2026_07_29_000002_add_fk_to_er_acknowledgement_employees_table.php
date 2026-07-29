<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('e_r_acknowledgement_employees', function (Blueprint $table) {
            $table->foreign('e_r_acknowledgement_item_id', 'er_ack_emp_item_fk')
                ->references('id')->on('e_r_acknowledgement_items')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('e_r_acknowledgement_employees', function (Blueprint $table) {
            $table->dropForeign('er_ack_emp_item_fk');
        });
    }
};
