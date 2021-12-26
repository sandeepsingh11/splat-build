@props([
    'weaponName' => 'Shooter_Short_00',
    'subName' => 'Bomb_Curling',
    'specialName' => 'SuperLanding',
    'inline' => false
])

<div id="weapon-container" class="grid grid-cols-1 justify-items-center @if($inline) grid-cols-2 gap-x-4 @endif">
    {{-- weapon --}}
    <img class="@if($inline) justify-self-end @endif" src="{{ asset('storage/weapons/Wst_' . $weaponName . '.png') }}" alt="{{ __($weaponName) }}" width="128px" height="128px" loading="lazy">
    
    {{-- sub, special --}}
    <div class="grid grid-cols-2 items-center gap-x-2 @if($inline) justify-self-start @endif">
        <img src="{{ asset('storage/subspe/Wsb_' . $subName . '.png') }}" alt="{{ $subName }}" loading="lazy">
        <img src="{{ asset('storage/subspe/Wsp_' . $specialName . '.png') }}" alt="{{ $specialName }}" loading="lazy">
    </div>
</div>