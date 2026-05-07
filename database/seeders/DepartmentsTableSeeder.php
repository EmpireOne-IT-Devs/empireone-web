<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            'IT Department',
            'HR Department',
            'Finance Department',
            'Operation Department',
            'Compliance Department',
            'Admin Department',
        ];

        foreach ($departments as $dept) {
            Department::firstOrCreate([
                'name' => $dept
            ]);
        }
    }
}
