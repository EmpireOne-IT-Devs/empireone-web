<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
        // $users = User::with('department')->orderBy('id', 'desc')->paginate(10);

        // if ($request->expectsJson()) {
        //     return response()->json($users);
        // }

        // return Inertia::render('Users/Index', ['users' => $users]);
        $users = User::get();
        return response()->json([
            'status' => $users,
        ], 200);
    }

    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:10',
            'gender' => 'nullable|string|in:male,female,other',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'role' => 'required|integer|in:1,2,3,4',
            'department_id' => 'nullable|exists:departments,id',
            'site' => 'required|string|max:255',
        ]);

        // Generate a default password
        $defaultPassword = 'Password123!';


        $user = User::create([
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'last_name' => $request->last_name,
            'suffix' => $request->suffix,
            'gender' => $request->gender,
            'department_id' => $request->department_id,
            'email' => $request->email,
            'password' => Hash::make($defaultPassword),
            'role' => $request->role,
            'site' => $request->site,
        ]);

        event(new Registered($user));

        // Return JSON response for API requests
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'User created successfully',
                'user' => $user->load('department'),
                'default_password' => $defaultPassword
            ], 201);
        }

        Auth::login($user);
        return redirect(route('dashboard', absolute: false));
    }
}
