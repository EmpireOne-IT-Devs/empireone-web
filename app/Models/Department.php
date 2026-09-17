<?php

namespace App\Models;

use App\Models\Account\AccountEmployee;
use App\Models\Account\AccountPersonalInformation;
use App\Models\ER\ERLeader;
use App\Models\Ticketing\Ticketing;
use App\Models\Ticketing\TicketingCategory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
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

    public function account_employees(): HasMany
    {
        return $this->hasMany(AccountEmployee::class, 'department_id');
    }

    /**
     * Get leaders in this department through account_employees.
     */
    public function department_leaders(): HasManyThrough
    {
        return $this->hasManyThrough(
            ERLeader::class,        // Final Model
            AccountEmployee::class, // Intermediate Model
            'department_id',        // Foreign key on account_employees table
            'user_id',          // Foreign key on e_r_leaders table
            'id',                   // Local key on departments table
            'id'                    // Local key on account_employees table
        )->with(['employee']);
    }

    public function manager(): HasOne
    {
        return $this->hasOne(AccountPersonalInformation::class, 'user_id', 'manager_id')->with(['employee']);
    }
}
