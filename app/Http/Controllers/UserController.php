<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function __construct() {
        $this->middleware(['auth']);
    }

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

    public function getGearStats(Request $request)
    {
        $user = $request->user();
     
        return $user->getGearStats();
    }

    public function getRecentGears(Request $request)
    {
        $user = $request->user();

        return $user->getRecentGears();
    }
}
