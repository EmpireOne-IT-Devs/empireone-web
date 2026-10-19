<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('account_pendings', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->unique();
            $table->string('status')->default('pending')->index();
            $table->foreignId('approved_by_user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
        });

        DB::table('account_pendings')
            ->whereNull('uuid')
            ->orderBy('id')
            ->chunkById(100, function ($pendings) {
                foreach ($pendings as $pending) {
                    DB::table('account_pendings')
                        ->where('id', $pending->id)
                        ->update(['uuid' => (string) Str::uuid()]);
                }
            });
    }

    public function down(): void
    {
        Schema::table('account_pendings', function (Blueprint $table) {
            $table->dropForeign(['approved_by_user_id']);
            $table->dropForeign(['user_id']);
            $table->dropUnique('account_pendings_uuid_unique');
            $table->dropColumn([
                'uuid',
                'status',
                'approved_by_user_id',
                'approved_at',
                'user_id',
            ]);
        });
    }
};
