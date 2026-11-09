<?php

namespace App\Models\Account;

use App\Models\Account;
use App\Models\Department;
use App\Models\ER\ERAcknowledgement;
use App\Models\ER\ERAcknowledgementEmployee;
use App\Models\ER\ERLeader;
use App\Models\ER\ERSubordinate;
use App\Models\Location;
use App\Models\PM\PMReach;
use App\Models\Site;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;

class AccountEmployee extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'user_id',
        'department_id',
        'e_r_leader_id',
        'site_id',
        'location_id',
        'account_id',
        'department_manager_id',
        'employee_id',
        'is_has_contract',
        'work_type',
        'eogs_email',
        'with_bpo',
        'position',
        'signature',
        'onboarding_agree_on',
        'status',
        'started_at',
        'position_level',
        'basic_pay',
        'allowance',
        'employment_status',
        'reason_for_separation',
        'is_rehire',
    ];

    /**
     * Appended weekly calculations.
     */
    protected $appends = [
        'week_1',
        'week_2',
        'week_3',
        'week_4',
    ];

    /**
     * Change these to your preferred default month/year if you want a fixed month (e.g. 10 for October).
     * Set to null to default to the current active month and year.
     */
    public static $defaultMonth = null; // e.g. 10 or now()->month
    public static $defaultYear  = null; // e.g. 2026 or now()->year

    /* =========================================================================
     | Weekly Reach Accessors & Filtering
     |======================================================================== */

    /**
     * Calculate reach values for a week interval constrained to the specified month/year.
     */
    protected function calculateWeekReach(int $startDay, int $endDay = 31)
    {
        if (!$this->relationLoaded('reaches')) {
            return 0;
        }

        $targetMonth = static::$defaultMonth ?? now()->month;
        $targetYear  = static::$defaultYear ?? now()->year;

        return $this->reaches
            ->filter(function ($reach) use ($startDay, $endDay, $targetMonth, $targetYear) {
                // Replace 'created_at' with your actual date column if it's named 'date' or 'reach_date'
                $reachDate = Carbon::parse($reach->created_at);

                return (int) $reachDate->year === (int) $targetYear
                    && (int) $reachDate->month === (int) $targetMonth
                    && $reachDate->day >= $startDay
                    && $reachDate->day <= $endDay;
            })
            ->count(); // <--- CHANGE FROM ->sum('value') TO ->count()
    }

    public function getWeek1Attribute()
    {
        return $this->calculateWeekReach(1, 7);
    }

    public function getWeek2Attribute()
    {
        return $this->calculateWeekReach(8, 14);
    }

    public function getWeek3Attribute()
    {
        return $this->calculateWeekReach(15, 21);
    }

    public function getWeek4Attribute()
    {
        return $this->calculateWeekReach(22, 31);
    }

    /* =========================================================================
     | Relationships & Notification
     |======================================================================== */

    public function routeNotificationForMail($notification)
    {
        return $this->eogs_email;
    }

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    /**
     * Define the default relation scoped to the target month/year
     */
    public function reaches(): HasMany
    {
        $targetMonth = static::$defaultMonth ?? now()->month;
        $targetYear  = static::$defaultYear ?? now()->year;

        return $this->hasMany(PMReach::class, 'user_id', 'user_id')
            ->whereMonth('created_at', $targetMonth) // Change 'created_at' if different
            ->whereYear('created_at', $targetYear);
    }
    public function er_leader()
    {
        return $this->hasOne(ERLeader::class, 'id', 'e_r_leader_id')->with(['employee']);
    }

    public function department_manager()
    {
        return $this->hasOne(ERLeader::class, 'id', 'department_manager_id')->with(['personal_information', 'second_level_manager']);
    }

    public function acknowledgements()
    {
        return ERAcknowledgement::with(['employee'])->get();
    }

    public function reporting_to()
    {
        return $this->hasOne(ERSubordinate::class, 'subordinate_id', 'user_id')->with(['leader']);
    }

    public function personal_information(): HasOne
    {
        return $this->hasOne(AccountPersonalInformation::class, 'user_id', 'user_id');
    }

    public function department(): HasOne
    {
        return $this->hasOne(Department::class, 'id', 'department_id')->with(['manager']);
    }

    public function account(): HasOne
    {
        return $this->hasOne(Account::class, 'id', 'account_id')->with(['ecfs']);
    }

    public function site(): HasOne
    {
        return $this->hasOne(Site::class, 'id', 'site_id');
    }

    public function location(): HasOne
    {
        return $this->hasOne(Location::class, 'id', 'location_id');
    }

    public function files(): HasMany
    {
        return $this->hasMany(AccountDocument::class, 'user_id', 'user_id');
    }
}
