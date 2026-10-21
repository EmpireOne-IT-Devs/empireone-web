<?php

namespace App\Models\Timekeeping;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
    public const VOLUNTARY_TIME_OFF = 'Voluntary Time Off';

    protected $fillable = [
        'user_id',
        'date',
        'leave_type',
        'reason',
        'status',
        'approved_by',
        'approved_at',
        'declined_by',
        'declined_at',
        'supervisor_note',
    ];

    protected $casts = [
        'date' => 'date',
        'approved_at' => 'datetime',
        'declined_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function decliner()
    {
        return $this->belongsTo(User::class, 'declined_by');
    }
}
