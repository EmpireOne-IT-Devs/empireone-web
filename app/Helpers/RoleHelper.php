<?php

namespace App\Helpers;

use App\Models\User;

class RoleHelper
{
    /**
     * Get all available roles
     */
    public static function getAllRoles(): array
    {
        return [
            User::ROLE_ADMIN => 'Administrator',
            User::ROLE_EMPLOYEE => 'Employee',
            User::ROLE_HR => 'HR',
            User::ROLE_MANAGER => 'Manager',
        ];
    }

    /**
     * Get role label by role ID
     */
    public static function getRoleLabel(int $roleId): string
    {
        $roles = self::getAllRoles();
        return $roles[$roleId] ?? 'Unknown';
    }

    /**
     * Get dashboard route by role
     */
    public static function getDashboardRoute(int $roleId): string
    {
        return match($roleId) {
            User::ROLE_ADMIN => '/administrator/dashboard',
            User::ROLE_EMPLOYEE => '/employee/dashboard',
            User::ROLE_HR => '/hr/dashboard', 
            User::ROLE_MANAGER => '/manager/dashboard',
            default => '/dashboard',
        };
    }

    /**
     * Check if role can access admin features
     */
    public static function canAccessAdmin(int $roleId): bool
    {
        return $roleId === User::ROLE_ADMIN;
    }

    /**
     * Check if role can access HR features
     */
    public static function canAccessHR(int $roleId): bool
    {
        return in_array($roleId, [User::ROLE_ADMIN, User::ROLE_HR]);
    }

    /**
     * Check if role can access manager features
     */
    public static function canAccessManager(int $roleId): bool
    {
        return in_array($roleId, [User::ROLE_ADMIN, User::ROLE_MANAGER]);
    }

    /**
     * Get accessible modules for a role
     */
    public static function getAccessibleModules(int $roleId): array
    {
        return match($roleId) {
            User::ROLE_ADMIN => [
                'users', 'activities', 'ticketing', 'job_posting', 
                'hr_central', 'rnr', 'store_admin', 'decoration',
                'time_keeping', 'finance', 'reports', 'analytics',
                'messages', 'settings'
            ],
            User::ROLE_EMPLOYEE => [
                'profile', 'tickets', 'attendance', 'training'
            ],
            User::ROLE_HR => [
                'employees', 'recruitment', 'performance', 'onboarding',
                'payroll', 'reports'
            ],
            User::ROLE_MANAGER => [
                'team', 'reports', 'performance', 'attendance', 'tickets'
            ],
            default => ['profile'],
        };
    }
}
