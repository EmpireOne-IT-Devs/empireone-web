<?php

namespace App\Models\AssetInventory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssetLiabilityForm extends Model
{
    public const PENDING = 'Pending Acknowledgment';

    public const ACKNOWLEDGED = 'Acknowledged';

    public const VOIDED = 'Voided';

    public const STATUSES = [self::PENDING, self::ACKNOWLEDGED, self::VOIDED];

    public const TEMPLATE_VERSION = 'asset-accountability-v1';

    public const SOURCE_PAPER = 'paper';

    public const PAPER_ASSET_TYPES = ['Laptop', 'Mobile Device', 'Headset', 'Other Equipment', 'ID & Lanyard', 'Access Badge/RFID'];

    public const SIGNING_ROUTE = 'asset-liability-forms.page.acknowledge';

    protected $fillable = [
        'uuid', 'item_request_id', 'assignee_id', 'employee_name', 'employee_number',
        'asset_tag', 'source', 'status', 'template_version', 'document', 'issue_date',
        'acknowledged_by', 'printed_name', 'signature', 'acknowledged_at',
        'voided_by', 'voided_at', 'void_reason', 'email_sent_at', 'paper_signed_date', 'recorded_by', 'paper_scan_path',
    ];

    protected $hidden = ['signature', 'paper_scan_path'];

    protected $casts = [
        'document' => 'array',
        'issue_date' => 'date',
        'paper_signed_date' => 'date',
        'signature' => 'encrypted',
        'acknowledged_at' => 'datetime',
        'voided_at' => 'datetime',
        'email_sent_at' => 'datetime',
    ];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    public function itemRequest(): BelongsTo
    {
        return $this->belongsTo(AssetItemRequest::class);
    }
}
