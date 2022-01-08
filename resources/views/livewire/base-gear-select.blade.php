<div>
    {{-- gear list --}}
    <label for="gear-id" class="block">Select gear:</label>
    <x-select-search :filteredList="$filteredList" :selectedItem="$gearName" selectId="gear-id" />


    {{-- gear image --}}
    <div>
        <img src="{{ asset('storage/gear/' . $gearName . '.png') }}" alt="{{ __($gearName) }}" class="mx-auto">
    </div>

    <div id="skill-main" class="drag-into border-2 border-r-0 border-b-0 border-solid border-gray-400 rounded-full bg-gray-900 mx-auto mb-4" style="width: 64px; height: 64px; box-shadow: 0 0 0 1px #000" data-source="slot">
        <img 
            src="{{ asset('storage/skills/' . $mainSkill . '.png') }}" 
            alt="{{ $mainSkill }}"
            class="slot-img draggable slot"
            data-skill-id="{{ $mainSkillId }}"
            data-skill-name="{{ $mainSkill }}"
            data-skill-type="Main"
            draggable="true"
        >
    </div>

    <input type="hidden" name="skill-main" id="hidden-skill-main" value="{{ $mainSkillId }}">
</div>
