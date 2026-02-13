<?php

namespace App\Models\Ticketing;

use App\Models\Department;
use App\Models\Ticketing;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketingCategory extends Model
{
    use HasFactory;

    protected $table = 'ticketing_categories';

    protected $fillable = [
        'name',
        'department_id',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function ticketings()
    {
        return $this->hasMany(Ticketing::class, 'ticket_category_id');
    }
}
