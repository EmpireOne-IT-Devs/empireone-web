<?php

namespace App\Models;

use App\Models\Account\AccountPersonalInformation;
use App\Models\Ticketing\Ticketing;
use App\Models\Ticketing\TicketingCategory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Department extends Model
{
    use HasFactory;

    protected $table = 'departments';

    protected $fillable = [
        'name',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function ticketings()
    {
        return $this->hasMany(Ticketing::class);
    }

    public function categories()
    {
        return $this->hasMany(TicketingCategory::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
    public function manager(): HasOne
    {
        return $this->hasOne(AccountPersonalInformation::class, 'user_id', 'manager_id')->with(['employee']);
    }
}
