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
        $sites = ['Site 1', 'Site 2', 'Site 3'];

        foreach ($sites as $site) {
            Site::create(['name' => $site]);
        }
    }
}
