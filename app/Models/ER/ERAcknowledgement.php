<?php

namespace App\Models\ER;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ERAcknowledgement extends Model
{
    protected $fillable = [
        'title',
        'file',
    ];
    public function items(): HasMany
    {
        return $this->hasMany(ERAcknowledgementItem::class, 'e_r_acknowledgement_id', 'id');
    }
}
