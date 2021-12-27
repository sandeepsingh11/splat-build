@props([
    'skillName' => 'unknown', 
    'imgSize' => 50,
    'id' => '',
    'dataSkillName' => ''
])

<div 
    class="border-2 border-r-0 border-b-0 border-solid border-gray-400 rounded-full bg-gray-900" 
    style="width: {{ $imgSize }}px; height: {{ $imgSize }}px; box-shadow: 0 0 0 1px #000"
    id={{ $id }}
>
    <img 
        src="{{ asset('storage/skills/' . $skillName . '.png') }}"
        alt="{{ __($skillName) }}"
        width="{{ $imgSize }}"
        height="{{ $imgSize }}"
        loading="lazy"
        data-skill-name="{{ $dataSkillName }}"
    >
</div>