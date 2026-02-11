<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobRequisition extends Model
{

    protected $fillable = [
        'department_id',
        'location_id',
        'type',
        'title',
        'employment_type',
        'number_of_positions',
        'priority',
        'salary_range',
        'target_start_date',
        'justification_for_position',
        'qualifications',
        'responsibilities',
        'status'
    ];

    protected $casts = [
        'target_start_date' => 'date',
        'number_of_positions' => 'integer',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }
}
