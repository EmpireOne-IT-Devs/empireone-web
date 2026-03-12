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
        $statuses = [
            'Pending',
            'Initial Phase',
            'Final Phase',
            'Passed',
            'Hired',
            'Pooling',
            'Failed'
        ];

        for ($i = 0; $i < 20; $i++) {

            JobApplication::create([
                'user_id' => rand(1, 5),
                'job_posting_id' => rand(1, 10),
                'status' => $statuses[array_rand($statuses)],
            ]);
        }
    }
}
