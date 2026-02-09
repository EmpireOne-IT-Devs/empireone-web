<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobRequisition extends Model
{
    protected $fillable = [
        'requisition_id',
        'position_type',
        'position_title',
        'department',
        'location',
        'employment_type',
        'number_of_positions',
        'priority',
        'salary_range',
        'target_start_date',
        'justification_for_position',
        'required_qualifications',
        'key_responsibilities',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($jobRequisition) {
            if (empty($jobRequisition->requisition_id)) {
                $jobRequisition->requisition_id = self::generateRequisitionId();
            }
        });
    }

    private static function generateRequisitionId()
    {
        $year = date('Y');
        
        $lastRequisition = self::where('requisition_id', 'like', "REQ-{$year}-%")
            ->orderBy('id', 'desc')
            ->first();

        if ($lastRequisition) {
            $parts = explode('-', $lastRequisition->requisition_id);
            $lastNumber = isset($parts[2]) ? (int) $parts[2] : 0;
            $number = $lastNumber + 1;
        } else {
            $number = 1;
        }

        return sprintf('REQ-%s-%04d', $year, $number);
    }
}
