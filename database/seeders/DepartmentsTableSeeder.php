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
            'Operations Department',
            'Compliance Department',
            'Jtv Account',
            'Aifi Account',
            'Weby Account',
            'Tog Account',
            'Gemporia Account',
            'Simple Tire Account',
            'Forma Account',
            'Curtis Account',

        ];

        foreach ($departments as $dept) {
            Department::firstOrCreate([
                'name' => $dept
            ]);
        }
    }
}
