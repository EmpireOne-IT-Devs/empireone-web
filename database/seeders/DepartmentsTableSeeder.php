<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = ['IT Department', 'HR Department', 'Finance Department', 'Operations Department', 'Utility Department', 'Compliance Department'];

        foreach ($departments as $dept) {
            Department::create(['name' => $dept]);
        }
    }
}
