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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('designation');
            $table->foreignId('document_type_id')->constrained('document_types')->onDelete('cascade');
            $table->date('document_date')->nullable();
            $table->date('document_deposite_date')->nullable();
            $table->boolean('is_privet')->default(false);
            $table->foreignId('joiner_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->text('description')->nullable();
            $table->string('pdf_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
