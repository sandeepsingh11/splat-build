@props(['gearName' => null])

<div class="p-4">
    <img src="{{ asset('storage/gear/' . $gearName . '.png') }}" alt="{{ __($gearName) }}" class="gear-img mx-auto" loading="lazy">
</div>