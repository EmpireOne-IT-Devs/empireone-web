<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Jobs\JobPosition;
use App\Models\Jobs\JobRequisition;
use App\Models\Department;
use Illuminate\Support\Facades\DB;

class JobPositionSeeder extends Seeder
{
    public function run(): void
    {
        // Wrap in transaction for safety
        DB::transaction(function () {

            // Get all departments as [name => id]
            $departments = Department::pluck('id', 'name');

            $positions = [

                // Management
                ['title' => 'ceo', 'department' => 'Operations Department'],
                ['title' => 'executive assistant', 'department' => 'Operations Department'],
                ['title' => 'executive director', 'department' => 'Operations Department'],
                ['title' => 'site director', 'department' => 'Operations Department'],

                // Operations
                ['title' => 'operations manager', 'department' => 'Operations Department'],
                ['title' => 'account manager', 'department' => 'Operations Department'],
                ['title' => 'customer service representative', 'department' => 'Operations Department'],
                ['title' => 'chat support', 'department' => 'Operations Department'],
                ['title' => 'order processor', 'department' => 'Operations Department'],

                // HR
                ['title' => 'hr director', 'department' => 'HR Department'],
                ['title' => 'talent acquisition manager', 'department' => 'HR Department'],
                ['title' => 'hr lead', 'department' => 'HR Department'],
                ['title' => 'hr generalist', 'department' => 'HR Department'],
                ['title' => 'hr business associate', 'department' => 'HR Department'],
                ['title' => 'talent acquisition associate', 'department' => 'HR Department'],
                ['title' => 'talent acquisition specialist', 'department' => 'HR Department'],
                ['title' => 'talent acquisition lead', 'department' => 'HR Department'],
                ['title' => 'compensation & benefits specialist', 'department' => 'HR Department'],
                ['title' => 'benefits associate', 'department' => 'HR Department'],
                ['title' => 'payroll specialist', 'department' => 'HR Department'],
                ['title' => 'payroll analyst', 'department' => 'HR Department'],

                // Finance
                ['title' => 'accounting manager', 'department' => 'Finance Department'],
                ['title' => 'accounting lead', 'department' => 'Finance Department'],
                ['title' => 'accounting associate', 'department' => 'Finance Department'],
                ['title' => 'accounting staff', 'department' => 'Finance Department'],

                // IT
                ['title' => 'it manager', 'department' => 'IT Department'],
                ['title' => 'web developer', 'department' => 'IT Department'],
                ['title' => 'network and security', 'department' => 'IT Department'],
                ['title' => 'system analyst / ui/ux designer', 'department' => 'IT Department'],
                ['title' => 'systems analyst', 'department' => 'IT Department'],
                ['title' => 'sr systems analyst', 'department' => 'IT Department'],
                ['title' => 'software engineer i', 'department' => 'IT Department'],
                ['title' => 'software engineer ii', 'department' => 'IT Department'],
                ['title' => 'lead software engineer', 'department' => 'IT Department'],

                // Compliance
                ['title' => 'compliance manager', 'department' => 'Compliance Department'],
                ['title' => 'compliance officer', 'department' => 'Compliance Department'],

                // Operations Support
                ['title' => 'workforce manager', 'department' => 'Operations Department'],
                ['title' => 'workforce officer', 'department' => 'Operations Department'],
                ['title' => 'real-time analyst (rta)', 'department' => 'Operations Department'],

                // Training & QA
                ['title' => 'training and quality assurance manager', 'department' => 'Operations Department'],
                ['title' => 'training and quality assurance officer', 'department' => 'Operations Department'],
                ['title' => 'qa trainee', 'department' => 'Operations Department'],
                ['title' => 'qa interim', 'department' => 'Operations Department'],

                // Facilities
                ['title' => 'facilities and admin manager', 'department' => 'Operations Department'],
                ['title' => 'facilities associate', 'department' => 'Operations Department'],
                ['title' => 'utility and maintenance', 'department' => 'Operations Department'],
                ['title' => 'company driver', 'department' => 'Operations Department'],
                ['title' => 'security personnel', 'department' => 'Operations Department'],

                // Accounts
                ['title' => 'Jtv - Chat', 'department' => 'Jtv Account'],
                ['title' => 'Latham Intake', 'department' => 'Aifi Account'],
                ['title' => 'Latham Processor', 'department' => 'Aifi Account'],
                ['title' => 'Latham Gli', 'department' => 'Aifi Account'],
                ['title' => 'Latham Designer', 'department' => 'Aifi Account'],
            ];

            foreach ($positions as $position) {
                $departmentId = $departments[$position['department']] ?? null;

                // Create Job Position
                $jobPosition = JobPosition::firstOrCreate([
                    'title' => ucwords($position['title']),
                    'department_id' => $departmentId,
                ]);

                // Create Job Requisition
                JobRequisition::create([
                    'department_id' => $departmentId,
                    'location_id' => 1,
                    'user_id' => 1,
                    'type' => 'New',
                    'title' => ucwords($position['title']),
                    'employment_type' => 'Full-time',
                    'number_of_positions' => rand(1, 10),
                    'priority' => ['Low', 'Medium', 'High', 'Urgent'][array_rand(['Low', 'Medium', 'High', 'Urgent'])],
                    'salary_range' => "₱1,000 - ₱2,000",
                    'target_start_date' => now()->addDays(rand(1, 30)),
                    'interviewer' => 'HR Test',
                    'sub_interviewer' =>  'HR Test',
                    'interview_date' => now()->addDays(rand(1, 30)),
                    'interview_time' => now()->format('H:i'),
                    'justification_for_position' => 'Seeding initial data',
                    'qualifications' => 'Seeding initial data',
                    'responsibilities' => 'Seeding initial data',
                    'status' => 'Pending',
                ]);
            }
        });
    }
}
