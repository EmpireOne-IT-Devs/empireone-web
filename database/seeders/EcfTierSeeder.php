<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class EcfTierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $now = Carbon::now();

        $tiers = [
            [
                'account_id' => 1, // Update this if these tiers belong to a specific account
                'name' => 'Starter',
                'original' => 'Tier 0',
                'role' => 'Buffer Pool Agent / New Hire',
                'responsibility' => "• In training or nesting\n• Handles basic support calls only\n• Paired for side-by-side training",
                'payout_details' => 'No Increase',
                'amount' => '0',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'account_id' => 1,
                'name' => 'Support Agent',
                'original' => 'Tier 1',
                'role' => 'Regular Support Agent',
                'responsibility' => "• Handles basic support calls (voice)\n• Assists with buddy-up or nesting support",
                'payout_details' => 'Basic Pay + ₱1,000',
                'amount' => '1000',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'account_id' => 1,
                'name' => 'Dual-Channel Agent',
                'original' => 'Tier 2',
                'role' => 'Voice + Chat/Email OR Sales Rollover',
                'responsibility' => "• Handles support + chat/email OR sales rollover\n• Can be reassigned based on volume",
                'payout_details' => 'Basic Pay + Tier 1 + ₱1,000',
                'amount' => '1000',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'account_id' => 1,
                'name' => 'Multi-Channel Agent',
                'original' => 'Tier 3',
                'role' => 'Multi-Channel Trained Agent',
                'responsibility' => "• Handles voice, chat, email, and sales\n• Fully cross-trained, flexible assignment",
                'payout_details' => 'Basic Pay + Tier 1 + Tier 2 + ₱1,000',
                'amount' => '1000',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'account_id' => 1,
                'name' => 'Beacon Specialist',
                'original' => 'Beacon',
                'role' => 'Install Outbound Caller',
                'responsibility' => "• Calls customers/installers to set appointments\n• Focused on installation process",
                'payout_details' => 'Current Pay + ₱1,000',
                'amount' => '1000',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'account_id' => 1,
                'name' => 'Expert / SME',
                'original' => 'Tier 4',
                'role' => 'SME / Floor Support Specialist',
                'responsibility' => "• Provides coaching & mentoring\n• Handles escalations\n• Supports QA & calibration\n• Backup TL duties",
                'payout_details' => 'Basic Pay + ₱5,000 Skills Allowance',
                'amount' => '5000',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('ecf_tiers')->insert($tiers);
    }
}