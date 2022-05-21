<?php

namespace App\Http\Controllers;

use App\Models\Weapon;
use Illuminate\Http\Request;

class WeaponController extends Controller
{
    public function getWeapons()
    {
        $weapons = [];

        foreach (Weapon::all() as $weapon) {
            $obj = new class{};
            $obj->name = $weapon->weapon_name;
            $obj->weapon_class = $weapon->weapon_class;
            $obj->sub_name = $weapon->sub->sub_name;
            $obj->special_name = $weapon->special->special_name;
            $obj->display_name = __($weapon->weapon_name);

            $weapons[] = $obj;
        }

        return $weapons;
    }
}
