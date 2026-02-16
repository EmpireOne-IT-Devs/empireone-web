<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\Account\AccountDocument;
use App\Models\Account\AccountPersonalInformation;
use App\Models\Account\AccountSkills;
use App\Models\Account\AccountWorkingExperience;
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
    use HasFactory, Notifiable, HasApiTokens, Notifiable;

    // Role constants
    public const ROLE_ADMIN = 1;
    public const ROLE_EMPLOYEE = 2;
    public const ROLE_APPLICANT = 3;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
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

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
    public function personal_information(): HasOne
    {
        return $this->hasOne(AccountPersonalInformation::class);
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
}
