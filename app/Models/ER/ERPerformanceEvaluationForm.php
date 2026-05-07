<?php

namespace App\Models\ER;

use App\Models\Account\AccountEmployee;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ERPerformanceEvaluationForm extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'supervisor_id',
        'has_supervisor_signature',
        'date_of_assessment',
        'remarks',
        'section1_average',
        'section2_average',
        'total_average',
        'recommendation',
        'evaluation_period',
        'status'
    ];

    protected $casts = [
        'has_supervisor_signature' => 'boolean',
        'date_of_assessment' => 'date',
        'section1_average' => 'float',
        'section2_average' => 'float',
        'total_average' => 'float',
    ];

    /**
     * Get the user who is being evaluated.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id')->with(['personal_information']);
    }

    public function employee(): HasOne
    {
        return $this->hasOne(AccountEmployee::class, 'user_id', 'user_id')->with(['department', 'account']);
    }

    /**
     * Get the supervisor who is conducting the evaluation.
     */
    public function supervisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'supervisor_id')->with(['personal_information', 'account_employee']);
    }

    /**
     * Get the Section 1 entries for this form.
     */
    public function section1s(): HasMany
    {
        return $this->hasMany(ERPerformanceEvaluationSection1::class, 'e_r_performance_evaluation_form_id', 'id');
    }

    /**
     * Get the Section 2 entries for this form.
     */
    public function section2s(): HasMany
    {
        return $this->hasMany(ERPerformanceEvaluationSection2::class, 'e_r_performance_evaluation_form_id', 'id');
    }
}
