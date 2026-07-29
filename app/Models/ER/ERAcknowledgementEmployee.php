<?php

namespace App\Models\ER;

use Illuminate\Database\Eloquent\Model;

class ERAcknowledgementEmployee extends Model
{
    protected $fillable = [
        'e_r_acknowledgement_id',
        'e_r_acknowledgement_item_id',
        'user_id'
    ];
}
