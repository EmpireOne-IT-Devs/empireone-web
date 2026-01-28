<?php

namespace Database\Seeders;

use App\Models\AgentAccount;
use App\Models\Department;
use App\Models\Location;
use App\Models\Site;
use App\Models\Ticketing;
use App\Models\TicketingCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TicketingsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = Department::all();
        $locations = Location::all();
        $sites = Site::all();
        $agents = AgentAccount::all();

        foreach ($departments as $department) {
            $categories = TicketingCategory::where('department_id', $department->id)->get();

            foreach ($categories as $category) {
                for ($i = 1; $i <= 3; $i++) {
                    Ticketing::create([
                        'ticketing_id' => 'TCK-' . Str::upper(Str::random(10)),
                        'ticket_category_id' => $category->id,
                        'location_id' => $locations->random()->id,
                        'site_id' => $sites->random()->id,
                        'department_id' => $department->id,
                        'user_id' => $agents->random()->id,
                        'details' => "Sample ticket details for {$category->name}",
                        'assigned_to' => 1,
                        'status' => ['pending', 'inprogress', 'resolved', 'closed'][array_rand(['pending', 'inprogress', 'resolved', 'closed'])],
                        'urgent_type' => ['Low Priority', 'Medium Priority', 'High Priority', 'Critical Priority'][array_rand(['Low Priority', 'Medium Priority', 'High Priority', 'Critical Priority'])],
                        'start_at' => now(),
                        'end_at' => now()->addDays(rand(1, 5)),
                    ]);
                }
            }
        }
    }
}
