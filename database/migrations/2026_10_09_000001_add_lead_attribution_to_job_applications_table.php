<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $columns = [
            'lead_source', 'utm_source', 'utm_medium', 'utm_campaign',
            'utm_content', 'utm_term', 'lead_referrer', 'lead_landing_page',
        ];

        Schema::table('job_applications', function (Blueprint $table) use ($columns) {
            $previous = Schema::hasColumn('job_applications', 'source') ? 'source' : null;

            foreach ($columns as $name) {
                if (! Schema::hasColumn('job_applications', $name)) {
                    $column = $table->string($name)->nullable();

                    if ($previous) {
                        $column->after($previous);
                    }
                }

                $previous = $name;
            }
        });
    }

    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            $table->dropColumn([
                'lead_source',
                'utm_source',
                'utm_medium',
                'utm_campaign',
                'utm_content',
                'utm_term',
                'lead_referrer',
                'lead_landing_page',
            ]);
        });
    }
};
