<?php

namespace Database\Seeders;

use App\Models\Jobs\JobApplication;
use Illuminate\Database\Seeder;

class JobApplicationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $final_statuses = [
            'Passed',
            'Failed',
            'Withdrawn',
            'Pooled',
            'Accepted Job Offer',
            'Hired',
            'Rejected',
            'No Show',
        ];
        $interview_status = [
            'Scheduled',
            'Not Scheduled',
            'Passed',
            'Failed',
            'No Show',
        ];

        $screening_status = [
            'New',
            'Conducted',
            'Screened Passed',
            'Screened Failed',
            'No Response',
        ];


        for ($i = 0; $i < 100; $i++) {
            JobApplication::create([
                'user_id' => rand(1, 5),
                'job_posting_id' => rand(1, 10),
                'screening_status' => $screening_status[array_rand($screening_status)],
                'interview_status' => $interview_status[array_rand($interview_status)],
                'final_status' => $final_statuses[array_rand($final_statuses)],
            ]);
        }
    }
}
