<?php

namespace App\Models\PM;

use App\Models\Account;
use App\Models\Account\AccountEmployee;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PMReach extends Model
{
    protected $fillable = [
        'created_by',
        'user_id',
        'employee_id',
        'first_name',
        'last_name',
        'employee_email',
        'supervisor_id',
        'supervisor_first_name',
        'supervisor_last_name',
        'supervisor_email',
        'account_id',
        'date_of_session',
        'recognition_statement_1',
        'recognition_statement_2',
        'recognition_statement_3',
        'area_of_opportunity',
        'kpi',
        'actual_metric',
        'goal_target',
        'biggest_rock',
        'behavioral_root_cause',
        'smart_goal',
        'task_name',
        'task_description',
        'due_date',
        'frequency',
        'employee_commitment',
        'leader_commitment',
        'next_follow_up_date',
        'follow_up_notes',
        'status',
    ];

    protected $casts = [
        'date_of_session' => 'date',
        'due_date' => 'date',
        'next_follow_up_date' => 'date',
    ];

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function employee(): HasOne
    {
        return $this->hasOne(AccountEmployee::class, 'employee_id', 'employee_id');
    }

    public function supervisor(): HasOne
    {
        return $this->hasOne(AccountEmployee::class, 'employee_id', 'employee_id');
    }
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
