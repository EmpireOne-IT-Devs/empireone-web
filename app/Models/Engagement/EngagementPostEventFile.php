<?php

namespace App\Models\Engagement;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Engagement\CompanyGallery;

class EngagementPostEventFile extends Model
{
    protected $fillable = [
        'engagement_post_event_id',
        'company_gallery_id',
        'name',
        'url',
    ];

    public function postEvent(): BelongsTo
    {
        return $this->belongsTo(EngagementPostEvent::class, 'engagement_post_event_id');
    }

    public function companyGallery(): BelongsTo
    {
        return $this->belongsTo(CompanyGallery::class, 'company_gallery_id');
    }
}