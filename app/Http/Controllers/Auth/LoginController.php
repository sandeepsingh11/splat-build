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
        $this->middleware(['guest']);
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
            $request->flashOnly(['username']);
            return back()->with('status', 'Incorrect credentials');
        }

        return redirect()->route('dashboard');
    }
}
