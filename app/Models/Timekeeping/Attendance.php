<?php

namespace App\Models\Timekeeping;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'clock_in',
        'break_start',
        'break_end',
        'clock_out',
        'status',
        'late_minutes',
        'undertime_minutes',
        'remarks',
    ];

    protected $appends = ['display_status'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getDisplayStatusAttribute(): string
    {
        if ($this->status === 'clocked_in') {
            return 'Clocked In';
        }

        if ($this->status === 'on_break') {
            return 'On Break';
        }

        if ($this->status === 'clocked_out') {
            if ($this->late_minutes > 0) {
                return 'Late';
            }
            if ($this->undertime_minutes > 0) {
                return 'Undertime';
            }
            return 'Present';
        }

        return 'Unknown';
    }
}
