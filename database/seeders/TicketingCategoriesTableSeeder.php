<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\TicketingCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TicketingCategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          $categories = [
            'IT Department' => ['Software Issue', 'Hardware Issue'],
            'HR Department' => ['Leave Request', 'Payroll Issue'],
            'Finance Department' => ['Invoice', 'Budget Request'],
            'Utility Department' => ['Customer Query', 'Complaint'],
            'Operations Department' => ['Customer Query', 'Complaint'],
            'Compliance Department' => ['Customer ', 'Complaint'],
        ];

        foreach ($categories as $deptName => $cats) {
            $department = Department::where('name', $deptName)->first();
            if (!$department) continue;

            foreach ($cats as $cat) {
                TicketingCategory::create([
                    'name' => $cat,
                    'department_id' => $department->id,
                ]);
            }
        }
    }
}
