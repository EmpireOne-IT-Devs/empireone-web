<?php

namespace App\Models\ER;

use App\Models\Account\AccountPersonalInformation;
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
        return $this->hasMany(ERSubordinate::class, 'er_leader_id', 'id')->with(['employee','leader']);
    }
     public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id')->with(['personal_information','account_employee']);
    }
}
