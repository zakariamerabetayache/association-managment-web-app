<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed childcare center data
        $this->call(ChildcareCenterSeeder::class);

        // Optionally generate additional random users for testing
        // \App\Models\User::factory(10)->create();
    }
}
