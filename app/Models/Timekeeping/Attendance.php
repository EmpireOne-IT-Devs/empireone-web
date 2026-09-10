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
        'holiday_id',
        'holiday_name',
        'is_regular_holiday',
        'is_special_holiday',
        'regular_holiday_mins',
        'special_holiday_mins',
    ];

    protected $casts = [
        'is_regular_holiday' => 'boolean',
        'is_special_holiday' => 'boolean',
    ];

    protected $appends = ['display_status'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function holiday()
    {
        return $this->belongsTo(Holiday::class);
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
