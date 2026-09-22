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
        Schema::create('joining_types', function (Blueprint $table) {
            $table->id();
            $table->string('designation_ar');
            $table->string('designation_fr');
            $table->integer('card_validity')->comment('1, 2, or 3 years');
            $table->integer('enrollment_code')->comment('0, 1, 2, or 3');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('joining_types');
    }
};
