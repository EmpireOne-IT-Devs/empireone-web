<?php

namespace App\Models\ER;

use App\Models\Account;
use App\Models\Account\AccountEmployee;
use App\Models\Department;
use App\Models\EcfTier;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class EREmployeeChangeForm extends Model
{
    protected $fillable = [
        'employee_id',
        'prepaired_by_id',
        'hire_date',
        'effective_date',
        'position_level',
        'position',
        'department',
        'account',
        'reporting_to',
        'reason_for_change',

        // "From" Information
        'info_position_level_from',
        'info_department_from',
        'info_account_from',
        'info_status_from',
        'info_position_from',
        'info_reporting_from',
        'info_basic_pay_from',
        'info_allowances_from',

        // "To" Information
        'info_position_level_to',
        'info_department_id_to',
        'info_department_id_from',
        'info_account_id_to',
        'info_account_id_from',
        'info_reporting_id_to',
        'info_reporting_id_from',
        'info_status_to',
        'info_position_to',
        'info_reporting_to',
        'info_basic_pay_to',
        'info_allowances_to',

        // Checkboxes
        'regular',
        'is_account_transfer',
        'is_department_transfer',
        'is_position_and_title',
        'is_tiering',
        
        'status',
    ];

    public function employee(): HasOne
    {
        return $this->hasOne(AccountEmployee::class, 'employee_id', 'employee_id')->with(['personal_information', 'user']);
    }
    public function account_to(): HasOne
    {
        return $this->hasOne(Account::class, 'id', 'info_account_id_to');
    }

    public function department_to(): HasOne
    {
        return $this->hasOne(Department::class, 'id', 'info_department_id_to');
    }
    public function prepaired_by(): HasOne
    {
        return $this->hasOne(AccountEmployee::class, 'user_id', 'prepaired_by_id')->with(['personal_information']);
    }
    // public function tiering(): HasOne
    // {
    //     return $this->hasOne(EcfTier::class, 'id', 'tiering');
    // }
}
