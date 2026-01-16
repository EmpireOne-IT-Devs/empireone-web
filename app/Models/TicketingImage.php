<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketingImage extends Model
{
    protected $fillable = [
        'ticketing_id',
        'url'
    ];
}
