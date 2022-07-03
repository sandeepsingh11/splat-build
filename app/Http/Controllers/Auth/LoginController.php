<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function __construct()
    {
        // user must be a guest to view, otherwise redirect
        // $this->middleware(['guest']);
    }
    
    public function index()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $this->validate($request, [
            'username' => 'required',
            'password' => 'required'
        ]);

        // sign in user
        if (!Auth::attempt($request->only('username', 'password'), $request->remember)) {
            // $request->flashOnly(['username']);
            return ['error' => 'Incorrect credentials'];
        }

        // prep user data to send over
        $user = Auth::user();
        
        // pass new session id token to FE
        $request->session()->regenerate();
        $token = session('_token');
        
        $userData = [
            'username' => $user->username,
            'email' => $user->email,
            'createdAt' => $user->created_at
        ];
        
        return [
            'success' => 'Logging in',
            'userData' => $userData,
            'token' => $token
        ];
    }
}
