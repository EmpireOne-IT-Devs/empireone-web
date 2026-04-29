<?php

namespace App\Models\ER;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ERSubordinate extends Model
{
    protected $fillable = [
        'er_leader_id',
        'subordinate_id'
    ];

    public function employee(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'subordinate_id')->with(['personal_information', 'account_employee']);
    }
    public function leader(): HasOne
    {
        return $this->hasOne(ERLeader::class, 'id', 'er_leader_id')->with(['user']);
    }
    
}
