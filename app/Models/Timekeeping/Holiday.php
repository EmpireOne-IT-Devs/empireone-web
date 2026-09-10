<?php

namespace App\Models\Timekeeping;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Holiday extends Model
{
    protected $fillable = [
        'name',
        'date',
        'type',
        'site',
        'created_by',
    ];

    protected $casts = [
        'date' => 'date:Y-m-d',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Find the holiday (if any) that applies to the given date and site.
     * A holiday scoped to "All" applies to every site.
     */
    public static function forDateAndSite(string $date, ?string $site): ?self
    {
        return static::whereDate('date', $date)
            ->where(function ($query) use ($site) {
                $query->where('site', 'All');

                if ($site) {
                    $query->orWhere('site', $site);
                }
            })
            ->orderByRaw("field(site, 'All') asc") // prefer a site-specific match over "All"
            ->first();
    }
}
