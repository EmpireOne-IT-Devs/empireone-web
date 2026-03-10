<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Jobs\JobPosition;

class JobPositionSeeder extends Seeder
{
    public function run(): void
    {
        $positions = [

            'ceo',
            'executive assistant',
            'executive director',
            'site director',
            'operations manager',
            'account manager',
            'hr director',
            'talent acquisition manager',
            'accounting manager',
            'it manager',
            'workforce manager',
            'compliance manager',
            'training and quality assurance manager',
            'hr lead',
            'account lead/team lead',
            'accounting lead',
            'hr staff - recruitment and hiring',
            'hr staff - compensation and benefits',
            'admin staff',
            'accounting staff',
            'it staff',
            'engagement officer',
            'compliance officer',
            'workforce officer',
            'training and quality assurance officer',
            'learning leadership and development (lld) specialist',
            'web developer',
            'network and security',
            'system analyst / ui/ux designer',
            'social media generalist',
            'customer service representative',
            'chat support',
            'trainee team lead',
            'interim team lead',
            'qa trainee',
            'qa interim',
            'order processor',
            'designer',
            'real-time analyst (rta)',
            'training and quality assurance',
            'utility and maintenance',
            'canteen concessionaire',
            'company driver',
            'security personnel',
            'director, learning, leadership & development',
            'director, human resources',
            'director, quality & training',
            'director, marketing & communications',
            'director, accounting & finance',
            'employee engagement specialist',
            'compliance manager',
            'operations manager',
            'talent acquisition manager',
            'talent acquisition associate',
            'talent acquisition specialist',
            'talent acquisition lead',
            'compensation & benefits specialist',
            'benefits associate',
            'accounting associate',
            'onboarding & tqa manager',
            'hr lead',
            'Jtv - Chat',
            'Latham Intake',
            'Latham Processor',
            'Latham Gli',
            'Latham Designer',

            // Added Positions 62–75
            'hr generalist',
            'hr business associate',
            'payroll specialist',
            'payroll analyst',
            'it manager',
            'systems analyst',
            'sr systems analyst',
            'security officer',
            'sr. security officer',
            'software engineer i',
            'software engineer ii',
            'lead software engineer',
            'facilities and admin manager',
            'facilities associate'



        ];

        foreach ($positions as $position) {
            JobPosition::create([
                'title' => ucwords($position)
            ]);
        }
    }
}
