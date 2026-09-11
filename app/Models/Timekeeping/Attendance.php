<?php

namespace App\Models\Timekeeping;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'clock_in_date',
        'clock_in_time',
        'break_start_date',
        'break_start_time',
        'break_end_date',
        'break_end_time',
        'clock_out_date',
        'clock_out_time',
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
        'clock_in_date' => 'date',
        'break_start_date' => 'date',
        'break_end_date' => 'date',
        'clock_out_date' => 'date',
    ];

    protected $appends = [
        'display_status',
        'clock_in_at',
        'break_start_at',
        'break_end_at',
        'clock_out_at',
    ];

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

    public function getClockInAtAttribute(): ?Carbon
    {
        return $this->combineDateAndTime($this->clock_in_date, $this->clock_in_time);
    }

    public function getBreakStartAtAttribute(): ?Carbon
    {
        return $this->combineDateAndTime($this->break_start_date, $this->break_start_time);
    }

    public function getBreakEndAtAttribute(): ?Carbon
    {
        return $this->combineDateAndTime($this->break_end_date, $this->break_end_time);
    }

    public function getClockOutAtAttribute(): ?Carbon
    {
        return $this->combineDateAndTime($this->clock_out_date, $this->clock_out_time);
    }

    /**
     * Combine a separate date column and time-of-day string into one Carbon instant.
     */
    private function combineDateAndTime(?Carbon $date, ?string $time): ?Carbon
    {
        if (!$date || !$time) {
            return null;
        }

        return Carbon::parse($date->toDateString() . ' ' . $time);
    }
}
