@props([
    'gears', 
    'skills',
    'gearName' => 'Hed_FST000',
    'gearSkillIds' => [27, 27, 27, 27],
    'gearSkillNames' => ['unknown', 'unknown', 'unknown', 'unknown'],
])



<div> 
    {{-- gear skill slots --}}
    <div>
        <div>
            {{-- select game gear (and main skill) --}}
            @livewire('base-gear-select', ['gears' => $gears, 'skills' => $skills, 'gearName' => $gearName, 'mainSkill' => $gearSkillNames[0], 'mainSkillId' => $gearSkillIds[0]])

            {{-- sub skills --}}
            <div class="flex justify-evenly mb-4">
                <div id="skill-sub-1" class="drag-into border-2 border-r-0 border-b-0 border-solid border-gray-400 rounded-full bg-gray-900" style="width: 50px; height: 50px; box-shadow: 0 0 0 1px #000" data-source="slot">
                    <img 
                        src="{{ asset('storage/skills/' . $gearSkillNames[1] . '.png') }}" 
                        alt="{{ $gearSkillNames[1] }}"
                        class="slot-img draggable slot"
                        data-skill-id="{{ $gearSkillIds[1] }}"
                        data-skill-name="{{ $gearSkillNames[1] }}"
                        data-skill-type="All"
                        draggable="true"
                    >
                </div>
                <div id="skill-sub-2" class="drag-into border-2 border-r-0 border-b-0 border-solid border-gray-400 rounded-full bg-gray-900" style="width: 50px; height: 50px; box-shadow: 0 0 0 1px #000" data-source="slot">
                    <img 
                        src="{{ asset('storage/skills/' . $gearSkillNames[2] . '.png') }}" 
                        alt="{{ $gearSkillNames[2] }}"
                        class="slot-img draggable slot"
                        data-skill-id="{{ $gearSkillIds[2] }}"
                        data-skill-name="{{ $gearSkillNames[2] }}"
                        data-skill-type="All"
                        draggable="true"
                    >
                </div>
                <div id="skill-sub-3" class="drag-into border-2 border-r-0 border-b-0 border-solid border-gray-400 rounded-full bg-gray-900" style="width: 50px; height: 50px; box-shadow: 0 0 0 1px #000" data-source="slot">
                    <img 
                        src="{{ asset('storage/skills/' . $gearSkillNames[3] . '.png') }}" 
                        alt="{{ $gearSkillNames[3] }}"
                        class="slot-img draggable slot"
                        data-skill-id="{{ $gearSkillIds[3] }}"
                        data-skill-name="{{ $gearSkillNames[3] }}"
                        data-skill-type="All"
                        draggable="true"
                    >
                </div>
            </div>

            <input type="hidden" name="skill-sub-1" id="hidden-skill-sub-1" value="{{ $gearSkillIds[1] }}">
            <input type="hidden" name="skill-sub-2" id="hidden-skill-sub-2" value="{{ $gearSkillIds[2] }}">
            <input type="hidden" name="skill-sub-3" id="hidden-skill-sub-3" value="{{ $gearSkillIds[3] }}">
        </div>
    </div>

    {{-- skills bank --}}
    {{-- main skill exclusives --}}
    <div class="grid grid-cols-6 mb-6">
        @foreach ($skills->where('is_main', true) as $skill)
            <div data-source="bank">
                <img 
                    src="{{ asset('storage/skills/' . $skill->skill_name . '.png') }}" 
                    alt="{{ $skill->skill_name }}"
                    class="draggable bank"
                    data-skill-id="{{ $skill->id }}"
                    data-skill-name="{{ $skill->skill_name }}"
                    data-skill-type="Main"
                    draggable="true"
                    loading="lazy"
                >
            </div>
        @endforeach
    </div>

    <hr class="w-4/5 mx-auto border-primary-400 border-t-2">
    
    {{-- all other skills --}}
    <div class="grid grid-cols-7 mt-6">
        @foreach ($skills->where('is_main', false) as $skill)
            <div data-source="bank">
                @if ($skill->id != 27) {{-- exclude skill 27 ('unknown') --}}
                    <img 
                        src="{{ asset('storage/skills/' . $skill->skill_name . '.png') }}" 
                        alt="{{ $skill->skill_name }}"
                        class="draggable bank"
                        data-skill-id="{{ $skill->id }}"
                        data-skill-name="{{ $skill->skill_name }}"
                        data-skill-type="All"
                        draggable="true"
                        loading="lazy"
                    >
                @endif
            </div>
        @endforeach
    </div>
</div>