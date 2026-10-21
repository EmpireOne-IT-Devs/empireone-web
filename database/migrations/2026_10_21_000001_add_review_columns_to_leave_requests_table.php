<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leave_requests', function (Blueprint $table) {
            $table->foreignId('approved_by')->nullable()->after('status')->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable()->after('approved_by');
            $table->foreignId('declined_by')->nullable()->after('approved_at')->constrained('users')->nullOnDelete();
            $table->timestamp('declined_at')->nullable()->after('declined_by');
            $table->text('supervisor_note')->nullable()->after('declined_at');
        });
    }

    public function down(): void
    {
        Schema::table('leave_requests', function (Blueprint $table) {
            $table->dropConstrainedForeignId('approved_by');
            $table->dropConstrainedForeignId('declined_by');
            $table->dropColumn(['approved_at', 'declined_at', 'supervisor_note']);
        });
    }
};
