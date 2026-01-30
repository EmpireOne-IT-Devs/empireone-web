<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'first_name' => 'Test',
            'middle_name' => 'Sample',
            'last_name' => 'User',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('admin'),
            'role' => 1
        ]);

        $this->call([
            DepartmentsTableSeeder::class,
            LocationsTableSeeder::class,
            SitesTableSeeder::class,
            AgentAccountsTableSeeder::class,
            TicketingCategoriesTableSeeder::class,
            TicketingsTableSeeder::class,
            TicketingHistoriesTableSeeder::class,
        ]);
    }
}
