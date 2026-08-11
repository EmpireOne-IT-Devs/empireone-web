<?php

namespace App\Models\ER;

use Illuminate\Database\Eloquent\Model;

class EREmployeeAttrition extends Model
{
    protected $fillable = [
        'employee_id',
        'position',
        'department',
        'account',
        'eogs_email',
        'started_at',
        'separation_date',
        'employment_status',
        'status',
        'reason',
        'is_rehire',
        'attrition_status',
    ];
}
