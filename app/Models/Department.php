<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}
