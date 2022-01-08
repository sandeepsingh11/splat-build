<?php

namespace App\Http\Livewire;

use App\Models\Weapon;
use Illuminate\Database\Eloquent\Collection;
use Livewire\Component;

class WeaponSearchSelect extends Component
{
    public Collection $weapons;
    public array $searchable;
    public array $filteredList;
    public string $searchTerm = '';
    public string $weaponName = 'Shooter_Short_00';
    public string $subName = 'Bomb_Curling';
    public string $specialName = 'SuperLanding';
    public string $label;
    public string $selectId;

    public function mount(string $label = "Weapon", string $selectId = "gearset-weapon")
    {
        $this->label = $label;
        $this->selectId = $selectId;
        $this->weapons = Weapon::all();

        // transform gear records into array, then translate
        $this->searchable = array_column($this->weapons->toArray(), "weapon_name", "id");
        foreach ($this->searchable as $key => $value) {
            $this->searchable[$key] = __($value);
        }

        $this->filteredList = $this->searchable;
    }

    public function render()
    {
        return view('livewire.weapon-search-select');
    }

    public function selectUpdate(int $weaponId)
    {
        $selectedWeapon = $this->weapons->where('id', $weaponId)->first();

        $this->weaponName = $selectedWeapon->weapon_name;
        $this->subName = $selectedWeapon->sub->sub_name;
        $this->specialName = $selectedWeapon->special->special_name;
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
