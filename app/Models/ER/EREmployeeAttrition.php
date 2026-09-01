<?php

namespace App\Models\ER;

use App\Models\Account\AccountEmployee;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class EREmployeeAttrition extends Model
{
    protected $fillable = [
        'user_id',
        'employee_id',
        'immediate_supervisor',
        'department_manager',
        'position',
        'department',
        'account',
        'eogs_email',
        'started_at',
        'separation_date',
        'employment_status',
        'status',
        'reason_for_separation',
        'is_rehire',
        'attrition_status',
    ];

    public function employee(): HasOne
    {
        return $this->hasOne(AccountEmployee::class, 'employee_id', 'employee_id')->with(['personal_information', 'user', 'site', 'department', 'er_leader']);
    }

    public function exit_clearance(): HasOne
    {
        return $this->hasOne(ERExitClearance::class, 'e_r_employee_attrition_id', 'id');
    }
      public function exit_interview(): HasOne
    {
        return $this->hasOne(ERExitInterview::class, 'e_r_employee_attrition_id', 'id');
    }
}
