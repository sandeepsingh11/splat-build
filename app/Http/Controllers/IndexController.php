<?php

namespace App\Http\Controllers;

use App\Models\Gear;
use App\Models\Gearset;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class IndexController extends Controller
{
    public function test()
    {
        return ['a' => 1, 'b' => 2, 'c' => 3];
    }
    public function index()
    {    
        $gear = new Gear();
        $recentGears = $gear->getRecentGears();

        $gearset = new Gearset();
        $recentGearsets = $gearset->getRecentGearsets(1);

        return view('index', [
            'recentGears' => $recentGears,
            'recentGearsets' => $recentGearsets
        ]);
    }
}
