<?php

namespace Database\Seeders;

use App\Models\AgentAccount;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AgentAccountsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $agents = ['JTV', 'Gemporia', 'Letham Pool', 'Weby', 'AIfi'];

        foreach ($agents as $agent) {
            AgentAccount::create(['name' => $agent]);
        }
    }
}
