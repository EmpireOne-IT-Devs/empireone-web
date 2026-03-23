<?php

namespace Database\Seeders;

use App\Models\Account;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //

        $accounts = [
            'JTV Account',
            'Aifi Account',
            'Weby Account',
            'TOG Account',
            'Gemporia Account',
            'Simple Tire Account',
            'Forma Account',
            'Curtis Account',
        ];

        foreach ($accounts as $value) {
            Account::create(['name' => $value]);
        }
    }
}
