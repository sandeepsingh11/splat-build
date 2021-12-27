<?php

namespace App\Http\Livewire;

use Illuminate\Database\Eloquent\Collection;
use Livewire\Component;

class UserGear extends Component
{

    public array $defaultGearNames = ['H' => 'Hed_FST000', 'C' => 'Clt_FST001', 'S' => 'Shs_FST000'];
    public Collection $gears;
    public string $gearType;
    public string $gearTitle = '';
    public string $gearName = 'Hed_FST000';
    public string $skillMain = 'unknown';
    public string $skillSub1 = 'unknown';
    public string $skillSub2 = 'unknown';
    public string $skillSub3 = 'unknown';
    public int $oldGearId = -1;
    public array $searchable;
    public array $filteredList;
    public string $searchTerm = '';

    public function mount(Collection $userGears, string $gearType, Collection $oldGears = null)
    {
        $this->gearType = $gearType;
        $this->gearName = $this->defaultGearNames[$gearType[0]];

        // filter gears by type
        $this->gears = $this->filterUserGearsByType($userGears);
        


        // get old gear if passed
        if ($oldGears !== null) {
            foreach ($oldGears as $oldGear) {
                // get the old gear for the passed gear type
                if ($oldGear->baseGears->base_gear_type === $this->gearType[0]) {
                    $this->oldGearId = $oldGear->id;
                    $this->updateGear($this->oldGearId);

                    break;
                }
            }
        }

        // transform gear records into array, then translate
        $this->searchable = array_column($this->gears->toArray(), "gear_title", "id");
        foreach ($this->searchable as $key => $value) {
            $this->searchable[$key] = __($value);
        }

        $this->filteredList = $this->searchable;
        // $this->mainSkill = $mainSkill;
        // $this->mainSkillId = $mainSkillId;
    }

    public function render()
    {
        return view('livewire.user-gear');
    }

    /**
     * Filter the user's gears of the specified gear type (passed from the Livewire params).
     * 
     * @param Collection $gears The collection of gears from a user
     * 
     * @return Collection A filtered collection of the specified gear type.
     */
    public function filterUserGearsByType($gears)
    {
        $filteredGears = $gears->filter(function($gear, $key) {
            return ($gear->baseGears->base_gear_type == $this->gearType[0]);
        });

        return $filteredGears;
    }

    public function updateGear($gearId)
    {
        // if no pre-existing gear is selected, use default
        if ($gearId == -1) {
            $this->fill([
                'gearName' => $this->defaultGearNames[$this->gearType[0]],
                'skillMain' => 'unknown',
                'skillSub1' => 'unknown',
                'skillSub2' => 'unknown',
                'skillSub3' => 'unknown',
            ]);

            return;
        }

        // find the gear which matches what the user selected in the select html element
        $selectedGear = $this->gears->where('id', $gearId)->first();
        $this->fill([
            'gearName' => $selectedGear->baseGears->base_gear_name,
            'skillMain' => $selectedGear->getSkillName('Main'),
            'skillSub1' => $selectedGear->getSkillName('Sub1'),
            'skillSub2' => $selectedGear->getSkillName('Sub2'),
            'skillSub3' => $selectedGear->getSkillName('Sub3'),
        ]);
    }

    public function selectUpdate(int $gearId)
    {
        $selectedGear = $this->gears->where('id', $gearId)->first();
        $this->gearTitle = $selectedGear->gear_title ?? '';
        $this->gearName = $selectedGear->baseGears->base_gear_name;
        $this->skillMain = $selectedGear->skills[0]->skill_name;
        $this->skillSub1 = $selectedGear->skills[1]->skill_name;
        $this->skillSub2 = $selectedGear->skills[2]->skill_name;
        $this->skillSub3 = $selectedGear->skills[3]->skill_name;
    }

    public function search()
    {
        if ($this->searchTerm != '') {
            $this->filteredList = array_filter($this->searchable, function($k) {
                return (str_contains(strtolower(__($k)), strtolower($this->searchTerm)));
            });
        }
        else {
            $this->filteredList = $this->searchable;
        }

        // if empty list, fill with default
        if (!isset(array_keys($this->filteredList)[0])) {
            $this->filteredList = $this->searchable;
        }

        // update gear selection
        $this->selectUpdate(array_keys($this->filteredList)[0]); 
    }
}
