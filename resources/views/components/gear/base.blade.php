<div class="bg-gray-700 rounded-md shadow-lg @if ($hover) transform hover:-translate-y-2 transition-transform @endif">
    @if ($link) <a href="{{ route('gears.show', $gear) }}"> @endif
        <x-gear.title :title="$gear->gear_title" />
        <x-gear.gear :gearName="$gear->baseGears->base_gear_name" />
    
        <div class="grid grid-cols-4 items-end">
            <x-gear.skill :skillName="$gear->getSkillName('Main')" :imgSize=64 />
            <x-gear.skill :skillName="$gear->getSkillName('Sub1')" />
            <x-gear.skill :skillName="$gear->getSkillName('Sub2')" />
            <x-gear.skill :skillName="$gear->getSkillName('Sub3')" />
        </div>
    
        <x-gear.desc :desc="$gear->gear_desc" />
    @if ($link) </a> @endif


    @auth
        @can('delete', $gear)
            <div class="flex justify-evenly">
                <div class="w-full">
                    <a href="{{ route('gears.edit', $gear) }}" class="block">
                        <div class="bg-secondary-400 w-full py-2 rounded-bl-md text-center">Edit</div>
                    </a>
                </div>

                <form action="{{ route('gears.delete', $gear) }}" method="post" class="w-full">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="bg-red-400 w-full py-2 rounded-br-md">Delete</button>
                </form>
            </div>
        @endcan
    @endauth
</div>