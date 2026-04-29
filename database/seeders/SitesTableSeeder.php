<?php

namespace Database\Seeders;

use App\Models\Site;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SitesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $sites = [
            ['location_id' => 1, 'name' => 'Site 1', 'address' => 'Pantalan'],
            ['location_id' => 1, 'name' => 'Site 2', 'address' => 'Dunganon'],
            ['location_id' => 1, 'name' => 'Site 3', 'address' => 'Center Mall'],
            ['location_id' => 2, 'name' => 'Site 1', 'address' => 'Gen. Luna St.'],
            ['location_id' => 3, 'name' => 'Site 1', 'address' => 'Cebu City.'],
        ];

        foreach ($sites as $site) {
            Site::create([
                'location_id' => $site['location_id'],
                'name'        => $site['name'],
                'address'     => $site['address'],
                'status'      => null, // Matches your screenshot
            ]);
        }
    }
}
