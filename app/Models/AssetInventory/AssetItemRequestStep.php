<?php

namespace App\Models\AssetInventory;

use Illuminate\Database\Eloquent\Model;

class AssetItemRequestStep extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'key', 'position', 'label', 'description', 'status', 'acted_by', 'approver_name', 'acted_at', 'remarks',
    ];

    protected $casts = ['acted_at' => 'datetime'];
}
