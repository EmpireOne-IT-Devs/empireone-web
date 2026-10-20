<?php

namespace App\Models\Account;

use App\Models\Location;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class AccountPending extends Model
{
    protected $attributes = [
        'status' => 'pending',
    ];

    protected $fillable = [
        'location_id',
        'full_name',
        'eid',
        'employee_email',
        'position',
        'uuid',
        'status',
        'approved_by_user_id',
        'approved_at',
        'declined_by_user_id',
        'declined_at',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'approved_at' => 'datetime',
            'declined_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (AccountPending $pending) {
            $pending->uuid ??= (string) Str::uuid();
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by_user_id');
    }

    public function declinedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'declined_by_user_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
