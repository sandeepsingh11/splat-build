<div>
    {{-- gear list --}}
    <label for="weapon-id" class="block">Test weapon:</label>
    <x-select-search :filteredList="$filteredList" :selectedItem="$weaponName" selectId="weapon-id" />

    {{-- display weapon, sub, special --}}
    <x-weapon-sub-special :weaponName="$weaponName" :subName="$subName" :specialName="$specialName" inline="true" />
</div>
