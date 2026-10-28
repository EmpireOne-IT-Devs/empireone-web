<?php

namespace App\Models\PM;

use App\Models\Account\AccountEmployee;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PMCorrectiveAction extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'employee_id',
        'is_employee_acknowledge',
        'nte_received_at',
        'first_name',
        'last_name',
        'eogs_email',
        'department_id',
        'hr_user_id',
        'hr_id',
        'hr_first_name',
        'hr_last_name',
        'hr_email',
        'is_hr_acknowledge',
        'supervisor_user_id',
        'supervisor_id',
        'supervisor_first_name',
        'supervisor_last_name',
        'supervisor_email',
        'is_supervisor_acknowledge',
        'manager_user_id',
        'manager_id',
        'manager_first_name',
        'manager_last_name',
        'manager_email',
        'is_manager_acknowledge',
        'category',
        'code_of_discipline_section',
        'date_of_occurrence',
        'description_of_infraction',
        'evidence_drive_url',
        'status',
        'date_issued',
        'employee_explanation',
        'employee_explanation_at',
        'final_sanction',
        'employee_commitment',
    ];

    protected $casts = [
        'code_of_discipline_section' => 'array', // or 'json'
    ];
    public function employee(): HasOne
    {
        return $this->hasOne(AccountEmployee::class, 'user_id', 'user_id')->with(['account', 'department']);
    }
    public function manager(): HasOne
    {
        return $this->hasOne(AccountEmployee::class, 'user_id', 'manager_user_id');
    }
    public function supervisor(): HasOne
    {
        return $this->hasOne(AccountEmployee::class, 'user_id', 'supervisor_user_id');
    }
    public function hr(): HasOne
    {
        return $this->hasOne(AccountEmployee::class, 'user_id', 'hr_user_id');
    }
}
