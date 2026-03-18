<?php

namespace Database\Seeders;

use App\Models\Jobs\JobPosting;
use Illuminate\Database\Seeder;

class JobPostingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $targetAudiences = ['Both', 'Internal', 'External'];
        $statuses = ['Active', 'Closed', 'Draft'];

        for ($i = 0; $i < 10; $i++) {

            JobPosting::create([
                'job_requisition_id' => rand(1, 10),
                'user_id' => rand(1, 5),
                'application_deadline' => now()->addDays(rand(7, 30))->format('Y-m-d'),
                'experience_required' => rand(0, 5) . ' years experience',
                'education_required' => 'Bachelor\'s Degree',
                'target_audience' => $targetAudiences[array_rand($targetAudiences)],
                'status' => $statuses[array_rand($statuses)],
            ]);
        }
    }
}
