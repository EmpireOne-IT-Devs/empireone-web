<?php

namespace App\Models\AssetInventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class AssetItemRequestStep extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'key', 'position', 'label', 'description', 'status', 'assigned_user_id', 'acted_by', 'approver_name', 'acted_at', 'remarks',
    ];

    protected $casts = ['acted_at' => 'datetime'];

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }
}
