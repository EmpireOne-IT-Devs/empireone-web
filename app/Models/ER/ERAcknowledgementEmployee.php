<?php

namespace App\Models\ER;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ERAcknowledgementEmployee extends Model
{
    protected $table = 'e_r_acknowledgement_employees';
    protected $fillable = [
        'e_r_acknowledgement_id',
        'e_r_acknowledgement_item_id',
        'user_id'
    ];


    public function ack(): BelongsTo
    {
        return $this->belongsTo(ERAcknowledgement::class, 'e_r_acknowledgement_id', 'id')->with(['items']);
    }
     public function item(): HasOne
    {
        return $this->hasOne(ERAcknowledgementItem::class, 'id', 'e_r_acknowledgement_item_id');
    }
}
