<?php

namespace App\Models\ER;

use Illuminate\Database\Eloquent\Model;

class ERAcknowledgementItem extends Model
{

    protected $fillable = [
        'e_r_acknowledgement_id',
        'title',
        'file'
    ];
}
