<?php

namespace App\Models\Engagement;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Engagement\EngagementPostEventFile;

class CompanyGallery extends Model
{
    protected $table = 'engagement_company_galleries';
    protected $fillable = [
        'title',
        'description',
        'drive_link',
        'user_id',
    ];

    public function files(): HasMany
    {
        return $this->hasMany(EngagementPostEventFile::class, 'company_gallery_id');
    }
}
