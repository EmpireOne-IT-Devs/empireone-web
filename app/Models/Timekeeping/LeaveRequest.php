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
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
