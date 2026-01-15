<?php

namespace Database\Seeders;

use App\Models\AgentAccount;
use App\Models\Ticketing;
use App\Models\TicketingHistory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TicketingHistoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = ['created', 'updated', 'assigned', 'status_change', 'comment'];

        foreach (Ticketing::all() as $ticket) {
            $historyCount = rand(1, 3);

            for ($i = 0; $i < $historyCount; $i++) {
                TicketingHistory::create([
                    'ticketing_id' => $ticket->id,
                    'employee_id' => AgentAccount::inRandomOrder()->first()->id,
                    'details' => "Sample history entry #$i for ticket {$ticket->ticketing_id}",
                    'type' => $types[array_rand($types)],
                ]);
            }
        }
    }
}
