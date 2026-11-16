<?php

namespace App\Models\PM;

use App\Models\Account;
use App\Models\Account\AccountEmployee;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PMPip extends Model
{
    protected $table = 'p_m_pips';

    protected $fillable = [
        'user_id',
        'created_by',
        'employee_id',
        'first_name',
        'last_name',
        'position',
        'employee_email',
        'account_id',
        'supervisor_id',
        'supervisor_user_id',
        'supervisor_name',
        'supervisor_email',

        'manager_id',
        'manager_user_id',
        'manager_name',
        'manager_email',

        'hr_user_id',
        'hr_id',
        'hr_first_name',
        'hr_last_name',
        'hr_email',

        'pip_start_date',
        'pip_end_date',
        'pip_cycle',


        'is_hr_approved',
        'is_manager_approved',
        'is_supervisor_approved',
        'is_employee_acknowledged',


        'is_passed',
        'sanction',

        'action_notes',


        'is_hr_final_approved',
        'is_manager_final_approved',
        'is_supervisor_final_approved',
        'is_employee_final_acknowledged',


        'history_kpi',
        'history_target',
        'history_actual',

        'root_cause_analysis',

        'action_kpi_goal',
        'action_target_action',
        'action_date',

        'status',
    ];

    protected $casts = [
        'pip_start_date' => 'date',
        'pip_end_date'   => 'date',
        'action_date'    => 'date',
    ];

    // Optional: Define relationships based on your schema

    /**
     * Get the user associated with the PIP.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function supervisor(): HasOne
    {
        return $this->hasOne(AccountEmployee::class, 'user_id', 'supervisor_user_id');
    }

    public function manager(): HasOne
    {
        return $this->hasOne(AccountEmployee::class, 'user_id', 'manager_user_id');
    }
    public function hr(): HasOne
    {
        return $this->hasOne(AccountEmployee::class, 'user_id', 'hr_user_id');
    }

    public function employee(): HasOne
    {
        return $this->hasOne(AccountEmployee::class, 'user_id', 'user_id');
    }


    public function account(): HasOne
    {
        return $this->hasOne(Account::class, 'id', 'account_id');
    }
    /**
     * Get the user who created the PIP.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
