<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketingHistory extends Model
{
    use HasFactory;

    protected $table = 'ticketing_histories';

    protected $fillable = [
        'ticketing_id',
        'employee_id',
        'details',
        'type',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function ticketing()
    {
        return $this->belongsTo(Ticketing::class);
    }

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }
}
