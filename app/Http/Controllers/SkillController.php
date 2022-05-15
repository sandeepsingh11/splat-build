<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function getSkillNames()
    {
        return Skill::all(['skill_name', 'is_main']);
    }
}
