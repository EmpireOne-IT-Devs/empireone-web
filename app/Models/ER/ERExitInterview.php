<?php

namespace App\Models\ER;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ERExitInterview extends Model
{
    protected $fillable = [
        'e_r_employee_attrition_id',
        'main_reason_for_leaving',
        'factors_leaving',
        'wish_had_known',
        'suggestions_for_management',
        'appropriate_support',
        'ratings',
        'employee_signature',
        'conducted_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'factors_leaving' => 'array',
        'ratings'         => 'array',
    ];

    /**
     * Get the attrition record associated with the exit interview.
     */
    public function attrition(): BelongsTo
    {
        return $this->belongsTo(EREmployeeAttrition::class, 'e_r_employee_attrition_id');
    }
}
