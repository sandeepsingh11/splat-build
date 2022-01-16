@props(['skillName' => 'Unknown', 'imgSize' => 50])

<div class="mx-auto p-2">
    <img src="{{ asset('storage/skills/' . $skillName . '.png') }}" alt="{{ $skillName }}" width="{{ $imgSize }}" height="{{ $imgSize }}" class="mx-auto" loading="lazy">
</div>