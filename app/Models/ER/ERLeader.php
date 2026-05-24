<?php

namespace App\Models\ER;

use App\Models\Account\AccountEmployee;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ERLeader extends Model
{
    protected $fillable = [
        'user_id',
    ];

    public function subordinates(): HasMany
    {
        return $this->hasMany(ERSubordinate::class, 'er_leader_id', 'id')->with(['employee', 'leader', 'has3_months_evaluation', 'has5_months_evaluation']);
    }
    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id')->with(['personal_information', 'account_employee']);
    }
    public function employee(): HasOne
    {
        return $this->hasOne(AccountEmployee::class, 'user_id', 'user_id')->with(['personal_information']);
    }
    public function member_handled(): int
    {
        return $this->hasMany(ERSubordinate::class, 'er_leader_id', 'id')->count();
    }
     public function leader(): int
    {
        return $this->hasMany(AccountEmployee::class, 'user_id', 'user_id')->count();
    }
}
