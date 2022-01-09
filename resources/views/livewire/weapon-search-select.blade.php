<div>
    {{-- gear list --}}
    <label for="{{ $selectId }}" class="block">{{ $label }}</label>
    <x-select-search :filteredList="$filteredList" :selectedItem="$weaponName" selectId="{{ $selectId }}" />
    <input type="hidden" name="selected-weapon-name" value="{{ $weaponName }}" id="selected-weapon-name">

    {{-- display weapon, sub, special --}}
    <x-weapon-sub-special :weaponName="$weaponName" :subName="$subName" :specialName="$specialName" inline="true" />
</div>
