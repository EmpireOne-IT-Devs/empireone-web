<?php

namespace App\Models\ER;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ERAcknowledgementItem extends Model
{
    protected $fillable = [
        'e_r_acknowledgement_id',
        'title',
        'file'
    ];
    public function employee(): HasMany
    {
        return $this->hasMany(ERAcknowledgementEmployee::class, 'e_r_acknowledgement_id', 'e_r_acknowledgement_id');
    }
}
