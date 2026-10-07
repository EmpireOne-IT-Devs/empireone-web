<?php

namespace App\Models\Timekeeping;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class AttendanceCorrection extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'time_in_correction',
        'time_out_correction',
        'clock_in_correction',
        'clock_out_correction',
        'break_start_correction',
        'break_end_correction',
        'break1_start',
        'break1_end',
        'break2_start',
        'break2_end',
        'break3_start',
        'break3_end',
        'time_in_2_correction',
        'time_out_2_correction',
        'clock_in_2_correction',
        'clock_out_2_correction',
        'shift2_break1_start',
        'shift2_break1_end',
        'shift2_break2_start',
        'shift2_break2_end',
        'shift2_break3_start',
        'shift2_break3_end',
        'reason',
        'status',
        'endorsed_by',
        'endorsed_at',
        'granted_by',
        'granted_at',
        'declined_by',
        'declined_at',
        'supervisor_note',
        'accounting_note',
    ];

    protected $casts = [
        'date' => 'date',
        'time_in_correction' => 'datetime',
        'time_out_correction' => 'datetime',
        'clock_in_correction' => 'datetime',
        'clock_out_correction' => 'datetime',
        'break_start_correction' => 'datetime',
        'break_end_correction' => 'datetime',
        'break1_start' => 'datetime',
        'break1_end' => 'datetime',
        'break2_start' => 'datetime',
        'break2_end' => 'datetime',
        'break3_start' => 'datetime',
        'break3_end' => 'datetime',
        'time_in_2_correction' => 'datetime',
        'time_out_2_correction' => 'datetime',
        'clock_in_2_correction' => 'datetime',
        'clock_out_2_correction' => 'datetime',
        'shift2_break1_start' => 'datetime',
        'shift2_break1_end' => 'datetime',
        'shift2_break2_start' => 'datetime',
        'shift2_break2_end' => 'datetime',
        'shift2_break3_start' => 'datetime',
        'shift2_break3_end' => 'datetime',
        'endorsed_at' => 'datetime',
        'granted_at' => 'datetime',
        'declined_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function endorser()
    {
        return $this->belongsTo(User::class, 'endorsed_by');
    }

    public function granter()
    {
        return $this->belongsTo(User::class, 'granted_by');
    }

    public function decliner()
    {
        return $this->belongsTo(User::class, 'declined_by');
    }
}
