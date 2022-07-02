<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function getUser()
    {
        $user = Auth::user();
        $userData = null;

        if ($user !== null) {
            $userData = [
                'username' => $user->username,
                'email' => $user->email,
                'createdAt' => $user->created_at
            ];
        }

        return $userData;
    }
}
