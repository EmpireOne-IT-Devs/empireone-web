<?php

namespace Database\Seeders;

use App\Models\Jobs\JobRequisition;
use Illuminate\Database\Seeder;

class JobRequisitionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = ['New Position', 'Replacement'];
        $employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary'];
        $priorities = ['Low', 'Medium', 'High', 'Urgent'];
        $statuses = ['Pending', 'In Progress', 'Approved', 'Declined'];
        $titles = [
            'Software Developer',
            'UI/UX Designer',
            'HR Officer',
            'Project Manager',
            'QA Tester'
        ];

        for ($i = 0; $i < 10; $i++) {
            JobRequisition::create([
                'department_id' => 1,
                'user_id' => rand(1, 5),
                'location_id' => 1,
                'account_id' => rand(1, 8),
                'type' => $types[array_rand($types)],
                'title' => $titles[array_rand($titles)],
                'employment_type' => $employmentTypes[array_rand($employmentTypes)],
                'number_of_positions' => rand(1, 5),
                'priority' => $priorities[array_rand($priorities)],
                'salary_range' => '₱' . rand(20000, 40000) . ' - ₱' . rand(50000, 80000),
                'target_start_date' => now()->addDays(rand(10, 30))->format('Y-m-d'),
                'interviewer' => 'John Doe',
                'sub_interviewer' => 'Jane Smith',
                'interview_date' => now()->addDays(rand(5, 15))->format('Y-m-d'),
                'interview_time' => '10:00:00',
                'justification_for_position' => 'Additional manpower required.',
                'qualifications' => 'Relevant degree and 2+ years experience.',
                'responsibilities' => 'Handle assigned department tasks.',
                'status' => $statuses[array_rand($statuses)]
            ]);
        }
    }
}
