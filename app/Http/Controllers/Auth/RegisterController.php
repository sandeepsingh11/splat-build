<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    public function __construct()
    {
        // user must be a guest to view, otherwise redirect
        $this->middleware(['guest']);
    }

    public function index()
    {
        return view('auth.register');
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'username' => ['required', 'max:255'],
            'email' => 'required|email',
            'password' => 'required|confirmed' // look for _confirmation
        ]);

        User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // sign in user
        Auth::attempt($request->only('username', 'password'));

        return redirect()->route('dashboard');
    }
}
