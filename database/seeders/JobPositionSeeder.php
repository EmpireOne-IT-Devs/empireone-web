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
                ['title' => 'CEO', 'department' => 'Operations Department'],
                ['title' => 'Executive Assistant', 'department' => 'Operations Department'],
                ['title' => 'Executive Director', 'department' => 'Operations Department'],
                ['title' => 'Site Director', 'department' => 'Operations Department'],

                // Operations
                ['title' => 'Operations Manager', 'department' => 'Operations Department'],
                ['title' => 'Account Manager', 'department' => 'Operations Department'],
                ['title' => 'Customer Service Representative', 'department' => 'Operations Department'],
                ['title' => 'Chat Support', 'department' => 'Operations Department'],
                ['title' => 'Order Processor', 'department' => 'Operations Department'],

                // HR
                ['title' => 'HR Director', 'department' => 'HR Department'],
                ['title' => 'Talent Acquisition Manager', 'department' => 'HR Department'],
                ['title' => 'HR Lead', 'department' => 'HR Department'],
                ['title' => 'HR Generalist', 'department' => 'HR Department'],
                ['title' => 'HR Business Associate', 'department' => 'HR Department'],
                ['title' => 'Talent Acquisition Associate', 'department' => 'HR Department'],
                ['title' => 'Talent Acquisition Specialist', 'department' => 'HR Department'],
                ['title' => 'Talent Acquisition Lead', 'department' => 'HR Department'],
                ['title' => 'Compensation & Benefits Specialist', 'department' => 'HR Department'],
                ['title' => 'Benefits Associate', 'department' => 'HR Department'],
                ['title' => 'Payroll Specialist', 'department' => 'HR Department'],
                ['title' => 'Payroll Analyst', 'department' => 'HR Department'],

                // Finance
                ['title' => 'Accounting Manager', 'department' => 'Finance Department'],
                ['title' => 'Accounting Lead', 'department' => 'Finance Department'],
                ['title' => 'Accounting Associate', 'department' => 'Finance Department'],
                ['title' => 'Accounting Staff', 'department' => 'Finance Department'],

                // IT
                ['title' => 'IT Manager', 'department' => 'IT Department'],
                ['title' => 'Web Developer', 'department' => 'IT Department'],
                ['title' => 'Network and Security', 'department' => 'IT Department'],
                ['title' => 'System Analyst / UI/UX Designer', 'department' => 'IT Department'],
                ['title' => 'Systems Analyst', 'department' => 'IT Department'],
                ['title' => 'Sr Systems Analyst', 'department' => 'IT Department'],
                ['title' => 'Software Engineer I', 'department' => 'IT Department'],
                ['title' => 'Software Engineer II', 'department' => 'IT Department'],
                ['title' => 'Lead Software Engineer', 'department' => 'IT Department'],

                // Compliance
                ['title' => 'Compliance Manager', 'department' => 'Compliance Department'],
                ['title' => 'Compliance Officer', 'department' => 'Compliance Department'],

                // Operations Support
                ['title' => 'Workforce Manager', 'department' => 'Operations Department'],
                ['title' => 'Workforce Officer', 'department' => 'Operations Department'],
                ['title' => 'Real-Time Analyst (RTA)', 'department' => 'Operations Department'],

                // Training & QA
                ['title' => 'Training and Quality Assurance Manager', 'department' => 'Operations Department'],
                ['title' => 'Training and Quality Assurance Officer', 'department' => 'Operations Department'],
                ['title' => 'QA Trainee', 'department' => 'Operations Department'],
                ['title' => 'QA Interim', 'department' => 'Operations Department'],

                // Facilities
                ['title' => 'Facilities and Admin Manager', 'department' => 'Operations Department'],
                ['title' => 'Facilities Associate', 'department' => 'Operations Department'],
                ['title' => 'Utility and Maintenance', 'department' => 'Operations Department'],
                ['title' => 'Company Driver', 'department' => 'Operations Department'],
                ['title' => 'Security Personnel', 'department' => 'Operations Department'],

                // Accounts
                ['title' => 'JTV - Chat', 'department' => 'Jtv Account'],
                ['title' => 'Latham Intake', 'department' => 'Aifi Account'],
                ['title' => 'Latham Processor', 'department' => 'Aifi Account'],
                ['title' => 'Latham GLI', 'department' => 'Aifi Account'],
                ['title' => 'Latham Designer', 'department' => 'Aifi Account'],
            ];

            $statuses = ['Pending', 'In Progress', 'Approved', 'Declined'];
            foreach ($positions as $position) {

                // Create Job Position
                $jobPosition = JobPosition::firstOrCreate([
                    'title' => ucwords($position['title']),
                    'department_id' => rand(1, 5),
                ]);

                // Create Job Requisition
                JobRequisition::create([
                    'department_id' => $jobPosition->department_id,
                    'location_id' => 1,
                    'user_id' => 1,
                    'account_id' => rand(1, 8),
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
                    'status' => $statuses[array_rand($statuses)]
                ]);
            }
        });
    }
}
