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
        Schema::create('etablissements', function (Blueprint $table) {
            $table->id();
            $table->string('designation_ar');
            $table->string('designation_fr');
            $table->string('logo')->nullable();
            $table->foreignId('wilaya_id')->constrained('wilayas')->onDelete('cascade');
            $table->foreignId('commune_id')->constrained('communes')->onDelete('cascade');
            
            // Owner information fields
            $table->string('owner_name_ar')->nullable();
            $table->string('owner_name_fr')->nullable();
            $table->string('owner_last_name_ar')->nullable();
            $table->string('owner_last_name_fr')->nullable();
            $table->string('rip', 20)->nullable(); // Tax identification number
            
            // Price field
            $table->decimal('price', 10, 2)->nullable(); // Price with 2 decimal places
            
            // Contact information fields
            $table->text('adress')->nullable(); // Address
            $table->string('phone')->nullable(); // Phone number
            $table->string('email')->nullable(); // Email address
            
            // Operating hours
            $table->time('opening_hour')->nullable(); // Opening hour
            $table->time('closing_hour')->nullable(); // Closing hour
            $table->boolean('is_validation')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('etablissements');
    }
};
