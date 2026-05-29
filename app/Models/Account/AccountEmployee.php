<?php

namespace App\Models\Account;

use App\Models\Account;
use App\Models\Department;
use App\Models\ER\ERLeader;
use App\Models\ER\ERSubordinate;
use App\Models\Site;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Notifications\Notifiable;

class AccountEmployee extends Model
{

    use  Notifiable;
    protected $fillable = [
        'user_id',
        'department_id', //
        'e_r_leader_id',
        'site_id', //
        'location_id', //
        'account_id', //
        'employee_id',
        'is_has_contract',
        'work_type', //
        'eogs_email',
        'with_bpo',
        'position', //
        'signature',
        'onboarding_agree_on',
        'status', //status
        'started_at', //
        'position_level', //
        'basic_pay', //
        'allowance', //
    ];


    public function routeNotificationForMail($notification)
    {
        return $this->eogs_email;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function er_leader()
    {
        return $this->hasOne(ERLeader::class, 'id', 'e_r_leader_id')->with(['employee']);
    }
    public function reporting_to()
    {
        return $this->hasOne(ERSubordinate::class, 'subordinate_id', 'user_id')->with(['leader']);
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
        return $this->hasOne(Account::class, 'id', 'account_id')->with(['ecfs']);
    }
    public function site(): HasOne
    {
        return $this->hasOne(Site::class, 'id', 'site_id')->with(['location']);
    }
}
