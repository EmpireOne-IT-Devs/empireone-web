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
        'hire_date',
        'effective_date',
        'position_level',
        'position',
        'department',
        'account',
        'prepaired_by_id',
        'reporting_to',
        'info_position_level_from',
        'info_department_from',
        'info_account_from',
        'info_status_from',
        'info_position_from',
        'info_reporting_from',
        'info_basic_pay_from',
        'info_allowances_from',
        'info_position_level_to',
        'info_department_id_to',
        'info_department_id_from',
        'info_account_id_to',
        'info_status_to',
        'info_position_to',
        'info_reporting_to',
        'status',
        'regular',
        'account_transfer',
        'department_transfer',
        'position_and_title',
        'tiering',
        'reason_for_change'
    ];

    public function employee(): HasOne
    {
        return $this->hasOne(AccountEmployee::class, 'employee_id', 'employee_id')->with(['personal_information','user']);
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
       public function tiering(): HasOne
    {
        return $this->hasOne(EcfTier::class, 'id', 'tiering');
    }
    
}
