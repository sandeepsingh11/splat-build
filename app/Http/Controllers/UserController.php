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

    public function getGearCount(Request $request)
    {
        $user = $request->user();
        
        $headCount = $user->getUserGearCount('H');
        $clothesCount = $user->getUserGearCount('C');
        $shoesCount = $user->getUserGearCount('S');
        $totalCount = $user->getUserGearCount();
     
        return [
            ['name' => 'head', 'count' => $headCount],
            ['name' => 'clothes', 'count' => $clothesCount],
            ['name' => 'shoes', 'count' => $shoesCount],
            ['name' => 'total', 'count' => $totalCount]
        ];
    }

    public function getRecentGears(Request $request)
    {
        $user = $request->user();

        return $user->getRecentGears();
    }
}
