<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $itDepartment = Department::where('name', 'IT Department')->first();
        $hrDepartment = Department::where('name', 'HR Department')->first();
        $financeDepartment = Department::where('name', 'Finance Department')->first();

        if ($itDepartment) {
            User::create([
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'john.doe@company.com',
                'password' => bcrypt('password123'),
                'department_id' => $itDepartment->id,
                'role' => User::ROLE_EMPLOYEE,
                'site' => 'Manila HQ'
            ]);

            User::create([
                'first_name' => 'Sarah',
                'last_name' => 'Chen',
                'email' => 'sarah.chen@company.com',
                'password' => bcrypt('password123'),
                'department_id' => $itDepartment->id,
                'role' => User::ROLE_MANAGER,
                'site' => 'Manila HQ'
            ]);

            User::create([
                'first_name' => 'Alex',
                'last_name' => 'Johnson',
                'email' => 'alex.johnson@company.com',
                'password' => bcrypt('password123'),
                'department_id' => $itDepartment->id,
                'role' => User::ROLE_EMPLOYEE,
                'site' => 'Cebu Branch'
            ]);
        }

        if ($hrDepartment) {
            User::create([
                'first_name' => 'Mike',
                'last_name' => 'Wilson',
                'email' => 'mike.wilson@company.com',
                'password' => bcrypt('password123'),
                'department_id' => $hrDepartment->id,
                'role' => User::ROLE_HR,
                'site' => 'Manila HQ'
            ]);

            User::create([
                'first_name' => 'Lisa',
                'last_name' => 'Brown',
                'email' => 'lisa.brown@company.com',
                'password' => bcrypt('password123'),
                'department_id' => $hrDepartment->id,
                'role' => User::ROLE_EMPLOYEE,
                'site' => 'Cebu Branch'
            ]);
        }

        if ($financeDepartment) {
            User::create([
                'first_name' => 'Robert',
                'last_name' => 'Martinez',
                'email' => 'robert.martinez@company.com',
                'password' => bcrypt('password123'),
                'department_id' => $financeDepartment->id,
                'role' => User::ROLE_MANAGER,
                'site' => 'Manila HQ'
            ]);
        }
    }
}
