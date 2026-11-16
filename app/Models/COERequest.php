<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class COERequest extends Model
{
    protected $table = 'coe_requests';

    protected $fillable = [
        'uuid', 'user_id', 'employee_id', 'purpose', 'requested_at',
    ];

    protected $casts = [
        'requested_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (COERequest $model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
