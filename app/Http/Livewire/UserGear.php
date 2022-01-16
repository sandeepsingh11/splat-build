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
    public string $skillMain = 'Unknown';
    public string $skillSub1 = 'Unknown';
    public string $skillSub2 = 'Unknown';
    public string $skillSub3 = 'Unknown';
    public int $oldGearId = -1;
    public array $searchable;
    public array $filteredList;
    public string $searchTerm = '';

    public function mount(Collection $userGears, string $gearType, Collection $oldGears = null)
    {
        // set gear type for this instance
        $this->gearType = $gearType;

        // get user gears of current gear type
        $this->gears = $this->filterUserGearsByType($userGears);

        // fill in default gear values
        // if old gear passed (editing page)
        if (!$oldGears->isEmpty()) {
            foreach ($oldGears as $oldGear) {
                // get the old gear for the given gear type instance
                if ($oldGear->baseGears->base_gear_type === $this->gearType[0]) {
                    $currentGear = $oldGear;
                    $this->fill([
                        'gearTitle' => $currentGear->gear_title ?? '',
                        'gearName' => $currentGear->baseGears->base_gear_name,
                        'skillMain' => $currentGear->getSkillName('Main'),
                        'skillSub1' => $currentGear->getSkillName('Sub1'),
                        'skillSub2' => $currentGear->getSkillName('Sub2'),
                        'skillSub3' => $currentGear->getSkillName('Sub3'),
                    ]);

                    $this->oldGearId = $oldGear->id;
                    $this->selectUpdate($this->oldGearId);

                    break;
                }
            }
        }
        // else if user has existing gear types to choose from
        else if (isset($this->gears[0])) {
            $currentGear = $this->gears[0];
            $this->fill([
                'gearTitle' => $currentGear->gear_title ?? '',
                'gearName' => $currentGear->baseGears->base_gear_name,
                'skillMain' => $currentGear->getSkillName('Main'),
                'skillSub1' => $currentGear->getSkillName('Sub1'),
                'skillSub2' => $currentGear->getSkillName('Sub2'),
                'skillSub3' => $currentGear->getSkillName('Sub3'),
            ]);
        }
        // else fill with generic gear
        else {
            $this->fill([
                'gearTitle' => '',
                'gearName' => $this->defaultGearNames[$this->gearType[0]],
                'skillMain' => 'Unknown',
                'skillSub1' => 'Unknown',
                'skillSub2' => 'Unknown',
                'skillSub3' => 'Unknown',
            ]);
        }

        // transform gear records into array, then translate
        $this->searchable = array_column($this->gears->toArray(), "gear_title", "id");
        foreach ($this->searchable as $key => $value) {
            $this->searchable[$key] = __($value);
        }

        $this->filteredList = $this->searchable;
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

    public function selectUpdate(int $gearId)
    {
        $selectedGear = $this->gears->where('id', $gearId)->first();
        $this->fill([
            'gearTitle' => $selectedGear->gear_title ?? '',
            'gearName' => $selectedGear->baseGears->base_gear_name,
            'skillMain' => $selectedGear->getSkillName('Main'),
            'skillSub1' => $selectedGear->getSkillName('Sub1'),
            'skillSub2' => $selectedGear->getSkillName('Sub2'),
            'skillSub3' => $selectedGear->getSkillName('Sub3'),
        ]);
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
