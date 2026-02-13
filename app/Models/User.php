<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, Notifiable;

    // Role constants
    public const ROLE_ADMIN = 1;
    public const ROLE_EMPLOYEE = 2;
    public const ROLE_APPLICANT = 3;
    public const ROLE_MANAGER = 4;

    // Role labels
    public static $roleLabels = [
        self::ROLE_ADMIN => 'Administrator',
        self::ROLE_EMPLOYEE => 'Employee',
        self::ROLE_APPLICANT => 'HR',
        self::ROLE_MANAGER => 'Manager',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
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

    /**
     * Check if user has a specific role
     */
    public function hasRole(int $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if user is an administrator
     */
    public function isAdmin(): bool
    {
        return $this->hasRole(self::ROLE_ADMIN);
    }

    /**
     * Check if user is an employee
     */
    public function isEmployee(): bool
    {
        return $this->hasRole(self::ROLE_EMPLOYEE);
    }

    /**
     * Check if user is HR
     */
    public function isHR(): bool
    {
        return $this->hasRole(self::ROLE_APPLICANT);
    }

    /**
     * Check if user is a manager
     */
    public function isManager(): bool
    {
        return $this->hasRole(self::ROLE_MANAGER);
    }

    /**
     * Get role label
     */
    public function getRoleLabel(): string
    {
        return self::$roleLabels[$this->role] ?? 'Unknown';
    }

    /**
     * Get dashboard route based on role
     */
    public function getDashboardRoute(): string
    {
        return match ($this->role) {
            self::ROLE_ADMIN => '/administrator/dashboard',
            self::ROLE_EMPLOYEE => '/employee/dashboard',
            self::ROLE_APPLICANT => '/hr/dashboard',
            self::ROLE_MANAGER => '/manager/dashboard',
            default => '/dashboard',
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * Get the department that the user belongs to.
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
