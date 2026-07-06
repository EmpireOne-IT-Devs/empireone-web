<?php

namespace App\Http\Requests\Auth;

use App\Models\Account\AccountEmployee;
use App\Models\User;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'login_id' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $login_id = $this->input('login_id');
        $password = $this->input('password');
        
        $userToLogin = null;

        // 1. Check if the input is an email address
        if (filter_var($login_id, FILTER_VALIDATE_EMAIL)) {
            
            // Search directly in the User table since email is stored there
            $userToLogin = User::where('email', $login_id)->first();
            
        } else {
            
            // 2. It's not an email, so assume it's an Employee ID.
            // Search the account_employees table first.
            $employee = AccountEmployee::where('employee_id', $login_id)->first();
            
            if ($employee) {
                // Use your relationship to grab the actual User account linked to this employee
                $userToLogin = $employee->user; 
            }
        }

        // 3. Check if we found a user AND if the typed password matches the database hash
        if (! $userToLogin || ! Hash::check($password, $userToLogin->password)) {
            RateLimiter::hit($this->throttleKey());

            // Throw the error back to your React 'login_id' input field
            throw ValidationException::withMessages([
                'login_id' => trans('auth.failed'),
            ]);
        }

        // 4. Everything matches! Log the user in.
        Auth::login($userToLogin, $this->boolean('remember'));

        RateLimiter::clear($this->throttleKey());
    }

    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'login_id' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('login_id')).'|'.$this->ip());
    }
}