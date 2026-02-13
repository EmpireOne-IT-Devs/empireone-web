<?php

namespace App\Models\Ticketing;

use Illuminate\Database\Eloquent\Model;

class TicketingImage extends Model
{
    protected $fillable = [
        'ticketing_id',
        'url'
    ];
}
