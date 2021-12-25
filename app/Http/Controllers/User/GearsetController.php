<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Controllers\GearAbstractController;
use App\Models\Gear;
use App\Models\Gearset;
use App\Models\Skill;
use App\Models\Special;
use App\Models\Sub;
use App\Models\User;
use App\Models\Weapon;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Redirect;
use Prophecy\Argument\Token\InArrayToken;

class GearsetController extends Controller
{
    public function __construct()
    {
        // user must be logged in to view, otherwise redirect
        $this->middleware(['auth'])
            ->except(['index', 'show']);
    }

    public function index(Request $request)
    {
        // get user's gearsets
        $user = $request->user();
        $gearsets = $user->gearsets->load(['gears.baseGears', 'gears.skills', 'weapon']);
        

        // prep gearsets to display them properly
        foreach($gearsets as $gearset) {
            // fill in a gearset with temp gears if it does not have all 3 gears
            $gearset = $gearset->prepareGearset();

            // order the gears from h->c->s
            $gearset = $gearset->orderGears();
        }
        
        

        // get view
        return view('users.gearsets.index', [
            'user' => $user,
            'gearsets' => $gearsets,
        ]);
    }

    public function show(Request $request, Gearset $gearset)
    {
        $user = $request->user();

        // get user's gearsets
        $gearset = $gearset->load(['gears.baseGears', 'gears.skills', 'weapon']);

        // fill in gearset with temp gears if it does not have all 3 gears
        $gearset = $gearset->prepareGearset();

        // order the gears from h->c->s
        $gearset = $gearset->orderGears();


        return view('users.gearsets.show', [
            'user' => $user,
            'gearset' => $gearset,
        ]);
    }

    public function create(Request $request)
    {
        // get user's gears
        $user = $request->user();
        $userGears = $user->gears->load(['baseGears', 'skills']);

        // get all weapons
        $weapons = Weapon::all();


        return view('users.gearsets.create', [
            'user' => $user,
            'gears' => $userGears,
            'weapons' => $weapons,
        ]);
    }

    public function store(Request $request)
    {
        // validate vals
        $this->validate($request, [
            'gearset-title' => 'max:256|string|nullable',
            'gearset-desc' => 'max:512|string|nullable',
            'gearset-mode-rm' => 'boolean',
            'gearset-mode-cb' => 'boolean',
            'gearset-mode-sz' => 'boolean',
            'gearset-mode-tc' => 'boolean',
            'gearset-weapon-id' => 'numeric',
            'gear-head-id' => 'numeric|nullable',
            'gear-clothes-id' => 'numeric|nullable',
            'gear-shoes-id' => 'numeric|nullable',
        ]);

        

        // prepare selected gears (if pre-existing gear was not selected, set to default gear)
        $headId = ($request->get('gear-head-id') == -1) ? null : $request->get('gear-head-id');
        $clothesId = ($request->get('gear-clothes-id') == -1) ? null : $request->get('gear-clothes-id');
        $shoesId = ($request->get('gear-shoes-id') == -1) ? null : $request->get('gear-shoes-id');



        // create gearset record
        $newGearset = $request->user()->gearsets()->create([
            'gearset_title' => $request->input('gearset-title'),
            'gearset_desc' => $request->input('gearset-desc'),
            'gearset_mode_rm' => $request->boolean('gearset-mode-rm'),
            'gearset_mode_cb' => $request->boolean('gearset-mode-cb'),
            'gearset_mode_sz' => $request->boolean('gearset-mode-sz'),
            'gearset_mode_tc' => $request->boolean('gearset-mode-tc'),
            'weapon_id' => $request->input('gearset-weapon-id'),
        ]);


        // associate the head, clothing, and shoes gear to the new gearset in the pivot table (if not null)
        if ($headId !== null) $newGearset->gears()->attach($headId);
        if ($clothesId !== null) $newGearset->gears()->attach($clothesId);
        if ($shoesId !== null) $newGearset->gears()->attach($shoesId);
        

        
        return Redirect::route('gearsets');
    }

    public function edit(Request $request, Gearset $gearset)
    {
        // get user's gears
        $user = $request->user();
        $userGears = $user->gears->load(['baseGears', 'skills']);

        // get all weapons
        $weapons = Weapon::all();


        return view('users.gearsets.edit', [
            'user' => $user,
            'gears' => $userGears,
            'gearset' => $gearset,
            'weapons' => $weapons,
        ]);
    }

    public function update(Request $request, Gearset $gearset)
    {
        // validate vals
        $this->validate($request, [
            'gearset-title' => 'max:256|string|nullable',
            'gearset-desc' => 'max:512|string|nullable',
            'gearset-mode-rm' => 'boolean',
            'gearset-mode-cb' => 'boolean',
            'gearset-mode-sz' => 'boolean',
            'gearset-mode-tc' => 'boolean',
            'gearset-weapon-id' => 'numeric',
            'gear-head-id' => 'numeric|nullable',
            'gear-clothes-id' => 'numeric|nullable',
            'gear-shoes-id' => 'numeric|nullable',
        ]);
        

        // prepare selected gears (if pre-existing gear was not selected, set to default gear)
        $headId = ($request->get('gear-head-id') == -1) ? null : $request->get('gear-head-id');
        $clothesId = ($request->get('gear-clothes-id') == -1) ? null : $request->get('gear-clothes-id');
        $shoesId = ($request->get('gear-shoes-id') == -1) ? null : $request->get('gear-shoes-id');



        // update gearset record
        $gearset->gearset_title = $request->input('gearset-title');
        $gearset->gearset_desc = $request->input('gearset-desc');
        $gearset->gearset_mode_rm = $request->boolean('gearset-mode-rm');
        $gearset->gearset_mode_cb = $request->boolean('gearset-mode-cb');
        $gearset->gearset_mode_sz = $request->boolean('gearset-mode-sz');
        $gearset->gearset_mode_tc = $request->boolean('gearset-mode-tc');
        $gearset->weapon_id = $request->input('gearset-weapon-id');

        // update if the model has new values
        if ($gearset->isDirty()) {
            $gearset->save();
        }



        // update the gears in the pivot table
        $gearset->updatePivot($headId, $clothesId, $shoesId);
        

        
        return Redirect::route('gearsets');
    }

    public function destroy(Gearset $gearset)
    {
        // check if the current user can delete the specified gear
        $this->authorize('delete', $gearset);

        // delete this model instance
        $gearset->delete();

        return back();
    }
}
