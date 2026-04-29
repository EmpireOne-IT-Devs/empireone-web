<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\Account\AccountContract;
use App\Models\Account\AccountDocument;
use App\Models\Account\AccountEmployee;
use App\Models\Account\AccountPersonalInformation;
use App\Models\Account\AccountSkills;
use App\Models\Account\AccountWorkingExperience;
use App\Models\ER\ERLeader;
use App\Models\ER\ERSubordinate;
use App\Models\Jobs\JobApplication;
use App\Models\Jobs\JobOffer;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    // Role constants
    public const ROLE_ADMIN = 1;
    public const ROLE_EMPLOYEE = 2;
    public const ROLE_APPLICANT = 3;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'google_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => 'integer',
        ];
    }

     public function subordinate(): HasOne
    {
        return $this->hasOne(ERSubordinate::class, 'subordinate_id', 'id')->with(['leader']);
    }
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
    public function personal_information(): HasOne
    {
        return $this->hasOne(AccountPersonalInformation::class, 'user_id', 'id');
    }
    public function account_employee(): HasOne
    {
        return $this->hasOne(AccountEmployee::class, 'user_id', 'id')->with(['account','site','department']);
    }
    public function documents(): HasMany
    {
        return $this->hasMany(AccountDocument::class);
    }
    public function working_experience(): HasMany
    {
        return $this->hasMany(AccountWorkingExperience::class);
    }
    public function skills(): HasMany
    {
        return $this->hasMany(AccountSkills::class);
    }

    public function cover_letter(): HasOne
    {
        return $this->hasOne(AccountDocument::class, 'user_id', 'id')->where('type', 'Cover Letter');
    }
    public function resume(): HasOne
    {
        return $this->hasOne(AccountDocument::class, 'user_id', 'id')->where('type', 'Resume');
    }
    public function salary(): HasOne
    {
        return $this->hasOne(JobOffer::class, 'user_id', 'id')->where('status', 'Accepted Job Offer');
    }
    public function account_contract(): HasOne
    {
        return $this->hasOne(AccountContract::class, 'user_id', 'id');
    }
    public function is_passed(): HasOne
    {
        return $this->hasOne(JobApplication::class, 'user_id', 'id')
            ->where(function ($query) {
                $query->where([
                    ['final_status', 'Passed'],
                    ['interview_status', 'Passed'],
                    ['screening_status', 'Screened Passed'],
                ])->orWhere([
                    ['final_status', 'Passed'],
                    ['interview_status', 'Passed'],
                    ['screening_status', 'Accepted Job Offer'],
                ])->orWhere([
                    ['final_status', 'Passed'],
                    ['interview_status', 'Passed'],
                    ['screening_status', 'Hired'],
                ]);
            })
            ->with(['job_posting']);
    }
}
