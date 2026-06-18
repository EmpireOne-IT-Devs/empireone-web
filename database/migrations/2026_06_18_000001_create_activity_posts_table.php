<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->string('type')->default('birthday');       
            $table->string('headline');
            $table->text('message');
            $table->string('month')->nullable();               
            $table->smallInteger('year')->nullable();          
            $table->string('publish_to')->default('All Employees');
            $table->timestamp('scheduled_at')->nullable();     
            $table->timestamp('published_at')->nullable();     
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_posts');
    }
};
