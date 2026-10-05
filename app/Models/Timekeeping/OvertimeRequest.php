<?php

namespace App\Models\Timekeeping;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class OvertimeRequest extends Model
{
    protected $fillable = [
        'user_id',
        'date',
        'start_at',
        'end_at',
        'overtime_minutes',
        'remark',
        'status',
        'endorsed_by',
        'endorsed_at',
        'approved_by',
        'approved_at',
        'declined_by',
        'declined_at',
        'supervisor_note',
        'accounting_note',
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'endorsed_at' => 'datetime',
        'approved_at' => 'datetime',
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

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function decliner()
    {
        return $this->belongsTo(User::class, 'declined_by');
    }
}
