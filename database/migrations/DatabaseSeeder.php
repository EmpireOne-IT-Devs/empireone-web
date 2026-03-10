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
        User::create([
            'name' => 'Wakin Dev',
            'email' => 'eogs.whojilla@gmail.com',
            'email_verified_at' => '2026-02-24 12:50:05',
            'password' => Hash::make('admin'),
            'role' => 1
        ]);

        User::create([
            'name' => 'Snickers Jay Magbanua',
            'email' => 'snickersjay10@gmail.com',
            'email_verified_at' => '2026-02-24 12:50:05',
            'password' => Hash::make('admin'),
            'role' => 1
        ]);

          User::create([
            'name' => 'Marlou Dev',
            'email' => 'webdev@empireonegroup.com',
            'email_verified_at' => '2026-02-24 12:50:05',
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
