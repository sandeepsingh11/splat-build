<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Controllers\GearAbstractController;
use App\Models\BaseGear;
use App\Models\Gear;
use App\Models\Skill;
use App\Models\User;
use App\Models\Weapon;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;

class GearController extends GearAbstractController
{
    public function __construct()
    {
        // user must be a guest to view, otherwise redirect
        $this->middleware(['auth'])
            ->except(['index', 'show']);
    }

    public function index(Request $request)
    {
        // get user's gear
        $user = $request->user();
        // $gears = $user->gears()->with(['user'])->paginate(20);
        $gears = $user->gears->load(['baseGears', 'skills']);


        return view('users.gears.index', [
            'user' => $user,
            'gears' => $gears,
        ]);
    }

    public function show(Request $request, Gear $gear)
    {
        $user = $request->user();
        // eager load gear's relationships
        $gear->load(['baseGears', 'skills']);
        
        return view('users.gears.show', [
            'user' => $user,
            'gear' => $gear,
        ]);
    }

    public function create(Request $request)
    {
        $user = $request->user();

        // get according splatdata
        $skills = Skill::all();
        $baseGears = BaseGear::all();
        $weapons = Weapon::all();



        return view('users.gears.create', [
            'user' => $user,
            'gears' => $baseGears,
            'skills' => $skills,
            'weapons' => $weapons
        ]);
    }

    public function store(Request $request)
    {
        // validate input
        $this->validate($request, [
            'gear-title' => 'max:255',
            'gear-desc' => 'max:512',
            'gear-id' => 'numeric|required',
            'skill-main' => 'numeric|nullable',
            'skill-sub-1' => 'numeric|nullable',
            'skill-sub-2' => 'numeric|nullable',
            'skill-sub-3' => 'numeric|nullable',
        ]);


        // prepare sub id's (if null, set skill id to 27 ('unknown'))
        $mainSkillId = ($request->get('skill-main') === null) ? 27 : $request->get('skill-main');
        $subSkill1Id = ($request->get('skill-sub-1') === null) ? 27 : $request->get('skill-sub-1');
        $subSkill2Id = ($request->get('skill-sub-2') === null) ? 27 : $request->get('skill-sub-2');
        $subSkill3Id = ($request->get('skill-sub-3') === null) ? 27 : $request->get('skill-sub-3');


        // create a gear piece THROUGH a user
        $newGear = $request->user()->gears()->create([
            'gear_title' => $request->get('gear-title'),
            'gear_desc' => $request->get('gear-desc'),
            'base_gear_id' => $request->get('gear-id'),
        ]);

        // attach gear's skills to the pivot table
        $newGear->skills()->attach($mainSkillId, ['skill_type' => 'Main']);
        $newGear->skills()->attach($subSkill1Id, ['skill_type' => 'Sub1']);
        $newGear->skills()->attach($subSkill2Id, ['skill_type' => 'Sub2']);
        $newGear->skills()->attach($subSkill3Id, ['skill_type' => 'Sub3']);


        return Redirect::route('gears');
    }

    public function edit(Request $request, Gear $gear)
    {
        $user = $request->user();

        // eager load gear's relationships
        $gear->load(['baseGears', 'skills']);

        // get according splatdata
        $baseGears = BaseGear::all();
        $skills = Skill::all();
        $weapons = Weapon::all();

        // prep data
        $gearSkillIds = [
            $gear->getSkillId('Main'),
            $gear->getSkillId('Sub1'),
            $gear->getSkillId('Sub2'),
            $gear->getSkillId('Sub3'),
        ];
        $gearSkillNames = [
            $gear->getSkillName('Main'),
            $gear->getSkillName('Sub1'),
            $gear->getSkillName('Sub2'),
            $gear->getSkillName('Sub3'),
        ];


        return view('users.gears.edit', [
            'user' => $user,
            'gear' => $gear,
            'gearSkillIds' => $gearSkillIds,
            'gearSkillNames' => $gearSkillNames,
            'baseGears' => $baseGears,
            'skills' => $skills,
            'weapons' => $weapons
        ]);
    }

    public function update(Request $request, Gear $gear)
    {
        // validate vals
        $this->validate($request, [
            'gear-title' => 'max:255',
            'gear-desc' => 'max:512',
            'gear-id' => 'numeric|required',
            'skill-main' => 'numeric|nullable',
            'skill-sub-1' => 'numeric|nullable',
            'skill-sub-2' => 'numeric|nullable',
            'skill-sub-3' => 'numeric|nullable',
        ]);


        // prepare sub id's (if null, set skill id to 27 ('unknown'))
        $mainSkillId = ($request->get('skill-main') === null) ? 27 : $request->get('skill-main');
        $subSkill1Id = ($request->get('skill-sub-1') === null) ? 27 : $request->get('skill-sub-1');
        $subSkill2Id = ($request->get('skill-sub-2') === null) ? 27 : $request->get('skill-sub-2');
        $subSkill3Id = ($request->get('skill-sub-3') === null) ? 27 : $request->get('skill-sub-3');


        // update local gear var
        $gear->gear_title = $request->get('gear-title');
        $gear->gear_desc = $request->get('gear-desc');
        $gear->base_gear_id = $request->get('gear-id');

        // update model in db if it has new values (is dirty)
        if ($gear->isDirty()) {
            $gear->save();
        }
        
        
        // update gear_skill pivot table
        $gear->updatePivotTable('Main', $mainSkillId);
        $gear->updatePivotTable('Sub1', $subSkill1Id);
        $gear->updatePivotTable('Sub2', $subSkill2Id);
        $gear->updatePivotTable('Sub3', $subSkill3Id);


        
        return redirect(route('gears'));
    }

    public function destroy(Gear $gear)
    {
        // check if the current user can delete the specified gear piece
        $this->authorize('delete', $gear);

        // delete this model instance
        $gear->delete();

        return back();
    }
}
