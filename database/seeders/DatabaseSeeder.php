<?php

namespace Database\Seeders;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->call([
            AccountSeeder::class,
            DepartmentsTableSeeder::class,
            LocationsTableSeeder::class,
            SitesTableSeeder::class,
            UsersTableSeeder::class,
            // JobPositionSeeder::class,
            // JobRequisitionSeeder::class,
            // JobPostingSeeder::class,
            // JobApplicationSeeder::class,
        ]);
    }
}
