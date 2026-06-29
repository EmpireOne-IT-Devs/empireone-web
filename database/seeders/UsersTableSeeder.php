<?php

namespace Database\Seeders;

use App\Models\Account\AccountEmployee;
use App\Models\User;
use App\Models\Account\AccountPersonalInformation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $specificUsers = [
            [
                'name' => 'Marlou Dev',
                'email' => 'webdev@empireonegroup.com',
                'role' => 1,
                'first_name' => 'Marlou',
                'middle_name' => 'Flores',
                'last_name' => 'Pepito',
                'position' => 'Web Developer',
                'eogs_email' => "webdev@empireonegroup.com"
            ],
            [
                'name' => 'Jona',
                'email' => 'hiring@empireonegroup.com',
                'role' => 1,
                'first_name' => 'Jona',
                'middle_name' => '',
                'last_name' => 'Serrano',
                'position' => 'Recruitment Staff',
                'eogs_email' => "hiring@empireonegroup.com"
            ],
            [
                'name' => 'Anabelle Marie Ubaldo',
                'email' => 'bem@empireonegroup.com',
                'role' => 1,
                'first_name' => 'Anabelle Marie',
                'middle_name' => '',
                'last_name' => 'Ubaldo',
                'position' => 'Talent Acquisition Manager',
                'eogs_email' => "bem@empireonegroup.com"
            ],
            [
                'name' => 'Mark Valencia',
                'email' => 'mark@empireonegroup.com',
                'role' => 1,
                'first_name' => 'Mark',
                'middle_name' => '',
                'last_name' => 'Valencia',
                'position' => 'Site Director',
                'eogs_email' => "mark@empireonegroup.com"
            ],
            [
                'name' => 'Wakin',
                'email' => 'wackyhojilla13@gmail.com',
                'role' => 1,
                'first_name' => 'Wakin',
                'middle_name' => 'D',
                'last_name' => 'Hojilla',
                'position' => 'IT',
                'eogs_email' => "eogs.whojilla@gmail.com"
            ],
            [
                'name' => 'Snickers',
                'email' => 'jaysnickersmirafuentes@gmail.com',
                'role' => 2,
                'first_name' => 'Snickers',
                'middle_name' => '',
                'last_name' => 'Hojilla',
                'position' => 'IT',
                'eogs_email' => "jaysnickersmirafuentes@gmail.com"
            ],
            [
                'name' => 'Snickers Jay Magbanua',
                'email' => 'snickersjay10@gmail.com',
                'role' => 3,
                'first_name' => 'Snickers',
                'middle_name' => '',
                'last_name' => 'Magbanua',
                'position' => 'IT',
                'eogs_email' => "snickersjay10@gmail.com"
            ],
        ];

        foreach ($specificUsers as $userData) {
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make('admin'),
                'role' => $userData['role'],
                'email_verified_at' => now(),
            ]);

            AccountPersonalInformation::create([
                'user_id' => $user->id,
                'contact' => (string)rand(10000000000, 99999999999),
                'first_name' => $userData['first_name'],
                'middle_name' => $userData['middle_name'],
                'last_name' => $userData['last_name'],
                'gender' => 'Not specified',
                'date_of_birth' => now()->subYears(rand(20, 35))->format('Y-m-d'),
                'region' => '',
                'province' => '',
                'city' => '',
                'barangay' => '',
                'street' => '',
                'zip_code' => '',
                'highest_level_of_education' => '',
            ]);

            AccountEmployee::create([
                'user_id' => $user->id,
                'department_id' => 1,
                'site_id' => 1,
                'location_id' => 1,
                'work_type' => 'Regular',
                'eogs_email' => $userData['eogs_email'],
                'employee_id' => (string)rand(100000, 9999999),
                'position' => $userData['position'],
            ]);
        }
    }
}
