<div class="w-full pb-6">
    {{-- this user gear type list --}}
    <label for="gear-{{ Str::lower($gearType) }}-id" class="block">{{ $gearType }} gear</label>
    <x-select-search :filteredList="$filteredList" :selectedItem="$gearName" selectId="gear-{{ Str::lower($gearType) }}-id" />

    {{-- gear --}}
    <x-gear.gear :gearName="$gearName" />

    {{-- skills --}}
    <div class="flex justify-evenly items-baseline">
        <x-skill-bubble :skillName="$skillMain" :imgSize=64 id="{{ Str::lower($gearType) }}-skill-main" :dataSkillName="$skillMain" />
        <x-skill-bubble :skillName="$skillSub1" id="{{ Str::lower($gearType) }}-skill-sub-1" :dataSkillName="$skillSub1" />
        <x-skill-bubble :skillName="$skillSub2" id="{{ Str::lower($gearType) }}-skill-sub-2" :dataSkillName="$skillSub2" />
        <x-skill-bubble :skillName="$skillSub3" id="{{ Str::lower($gearType) }}-skill-sub-3" :dataSkillName="$skillSub3" />
    </div>
</div>

{{-- <div class="w-full">
    <label for="gear-{{ Str::lower($gearType) }}-id" class="block text-center">{{ $gearType }} gear</label>
    <select 
        wire:change="updateGear($event.target.value)" 
        name="gear-{{ Str::lower($gearType) }}-id" 
        id="gear-{{ Str::lower($gearType) }}-id"
        class="w-full rounded focus:ring-primary-400 focus:border-primary-400"
        >
        <option value="-1">===== {{ $gearType }} =====</option>

        @foreach ($gears as $gear)
            @if ( $gear->baseGears->base_gear_type == $gearType[0] )
                <option value="{{ $gear->id }}" @if($oldGearId == $gear->id) selected @endif>{{ $gear->gear_title }}</option>
            @endif
        @endforeach
    </select>

    <div id="gear-{{ $gearType }}">
        <img class="mx-auto" src="{{ asset('storage/gear/' . $gearName . '.png') }}" alt="{{ $gearName }}" loading="lazy">
        <div class="flex justify-evenly items-baseline">
            <div id="{{ Str::lower($gearType) }}-skill-main" class="border-2 border-r-0 border-b-0 border-solid border-gray-400 rounded-full bg-gray-900" style="width: 64px; height: 64px; box-shadow: 0 0 0 1px #000">
                <img src="{{ asset('storage/skills/' . $skillMain . '.png') }}" alt="{{ $skillMain }}" loading="lazy" data-skill-name="{{ $skillMain }}">
            </div>
            <div id="{{ Str::lower($gearType) }}-skill-sub-1" class="border-2 border-r-0 border-b-0 border-solid border-gray-400 rounded-full bg-gray-900" style="width: 50px; height: 50px; box-shadow: 0 0 0 1px #000">
                <img src="{{ asset('storage/skills/' . $skillSub1 . '.png') }}" alt="{{ $skillSub1 }}" loading="lazy" data-skill-name="{{ $skillSub1 }}">
            </div>
            <div id="{{ Str::lower($gearType) }}-skill-sub-2" class="border-2 border-r-0 border-b-0 border-solid border-gray-400 rounded-full bg-gray-900" style="width: 50px; height: 50px; box-shadow: 0 0 0 1px #000">
                <img src="{{ asset('storage/skills/' . $skillSub2 . '.png') }}" alt="{{ $skillSub2 }}" loading="lazy" data-skill-name="{{ $skillSub2 }}">
            </div>
            <div id="{{ Str::lower($gearType) }}-skill-sub-3" class="border-2 border-r-0 border-b-0 border-solid border-gray-400 rounded-full bg-gray-900" style="width: 50px; height: 50px; box-shadow: 0 0 0 1px #000">
                <img src="{{ asset('storage/skills/' . $skillSub3 . '.png') }}" alt="{{ $skillSub3 }}" loading="lazy" data-skill-name="{{ $skillSub3 }}">
            </div>
        </div>
    </div>
</div> --}}
