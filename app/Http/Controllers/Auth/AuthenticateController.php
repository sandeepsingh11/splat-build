<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class AuthenticateController extends Controller
{
    public function getToken(Request $request)
    {
        return ['token' => Crypt::encryptString($request->session()->token())];
    }
}
