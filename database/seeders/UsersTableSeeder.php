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
        // $firstNames = ['Marlou', 'John', 'Jane', 'Mark', 'Emily', 'Paul', 'Anna'];
        // $middleNames = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.', 'G.'];
        // $lastNames = ['Dev', 'Doe', 'Smith', 'Johnson', 'Reyes', 'Santos', 'Lopez'];

        // Specific users (like admin)
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
                'email' => 'sample@empireonegroup.com',
                'role' => 1,
                'first_name' => 'Jona',
                'middle_name' => '',
                'last_name' => 'Serrano',
                'position' => 'HR Staff',
                'eogs_email' => "hiring@empireonegroup.com"
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
                'role' => 1,
                'first_name' => 'Snickers',
                'middle_name' => '',
                'last_name' => 'Hojilla',
                'position' => 'IT',
                'eogs_email' => "jaysnickersmirafuentes@gmail.com"
            ],
            [
                'name' => 'Snickers Jay Magbanua',
                'email' => 'snickersjay10@gmail.com',
                'role' => 2,
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

        // Generate 5 random users
        // for ($i = 1; $i <= 5; $i++) {
        //     $firstName = $firstNames[array_rand($firstNames)];
        //     $middleName = $middleNames[array_rand($middleNames)];
        //     $lastName = $lastNames[array_rand($lastNames)];

        //     $user = User::create([
        //         'name' => "$firstName $lastName",
        //         'email' => strtolower($firstName) . $i . '@company.com',
        //         'password' => Hash::make('password'),
        //         'role' => rand(1, 3),
        //         'email_verified_at' => now(),
        //     ]);

        //     AccountPersonalInformation::create([
        //         'user_id' => $user->id,
        //         'contact' => (string)rand(10000000000, 99999999999),
        //         'first_name' => $firstName,
        //         'middle_name' => $middleName,
        //         'last_name' => $lastName,
        //         'gender' => 'Not specified',
        //         'date_of_birth' => now()->subYears(rand(20, 35))->format('Y-m-d'),
        //         'region' => '',
        //         'province' => '',
        //         'city' => '',
        //         'barangay' => '',
        //         'street' => '',
        //         'zip_code' => '',
        //         'highest_level_of_education' => '',
        //     ]);
        // }
    }
}
