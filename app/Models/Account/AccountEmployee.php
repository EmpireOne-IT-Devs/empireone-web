<?php

namespace App\Models\Account;

use App\Models\Account;
use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Notifications\Notifiable;

class AccountEmployee extends Model
{

    use  Notifiable;
    protected $fillable = [
        'user_id',
        'department_id',
        'site_id',
        'location_id',
        'account_id',
        'employee_id',
        'account_contract_id',
        'work_type',
        'eogs_email',
        'with_bpo',
        'position',
        'signature',
        'onboarding_agree_on',
        'status',
        'started_at'
    ];


    public function routeNotificationForMail($notification)
    {
        return $this->eogs_email;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function personal_information(): HasOne
    {
        return $this->hasOne(AccountPersonalInformation::class, 'user_id', 'user_id');
    }
    public function department(): HasOne
    {
        return $this->hasOne(Department::class, 'id', 'department_id');
    }
    public function account(): HasOne
    {
        return $this->hasOne(Account::class, 'id', 'account_id');
    }
    public function site(): HasOne
    {
        return $this->hasOne(Account::class, 'id', 'site_id');
    }
}
