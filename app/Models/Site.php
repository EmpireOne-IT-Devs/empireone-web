<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Site extends Model
{
    protected $fillable = [
        'location_id',
        'name',
        'address',
        'status',
    ];

     public function location(): HasOne
    {
        return $this->hasOne(Location::class, 'id', 'location_id');
    }
}
