<?php

namespace App\Models\ER;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ERPerformanceEvaluationSection1 extends Model
{
    use HasFactory;

    protected $fillable = [
        'e_r_performance_evaluation_form_id',
        'objective',
        'action',
        'outcome',
        'rating',
    ];

    protected $casts = [
        'rating' => 'float',
    ];

    /**
     * Get the evaluation form that owns this section entry.
     */
    public function form(): HasOne
    {
        return $this->hasOne(ErPerformanceEvaluationForm::class,'id', 'e_r_performance_evaluation_form_id');
    }
}
