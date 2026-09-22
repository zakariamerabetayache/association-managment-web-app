<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('joiner_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('joiner_id')->constrained('users');
            $table->foreignId('user_id')->constrained('users');
            $table->integer('type')->nullable(); // 0: summon, 1: file request
            $table->text('description')->nullable();
            $table->integer('state')->default(0); // 0: sent, 1: attended, 2: cancelled
            $table->string('pdf_path')->nullable();
            $table->tinyInteger('pdf_state')->default(0); // 0: not uploaded, 1: uploaded, 2: accepted
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('joiner_requests');
    }
};
