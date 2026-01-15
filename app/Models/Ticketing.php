<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticketing extends Model
{
    use HasFactory;

    protected $table = 'ticketings';

    protected $fillable = [
        'ticketing_id',
        'ticket_category_id',
        'location_id',
        'site_id',
        'department_id',
        'agent_account_id',
        'details',
        'assigned_to',
        'status',
        'priority_type',
        'start_at',
        'end_at',
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at'   => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function category()
    {
        return $this->belongsTo(TicketingCategory::class, 'ticket_category_id');
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function site()
    {
        return $this->belongsTo(Site::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_account_id');
    }

    public function histories()
    {
        return $this->hasMany(TicketingHistory::class);
    }
}
