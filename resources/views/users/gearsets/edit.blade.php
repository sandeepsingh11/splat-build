@extends('layouts.app')

@section('scripts-head')
    <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.8.2/dist/alpine.min.js" defer></script>
@endsection

@section('styles')
    @livewireStyles
@endsection

@section('content')
    <form action="{{ route('gearsets.update', [$user, $gearset]) }}" method="post" class="w-full md:w-3/4 lg:w-2/3 px-4 md:px-0 md:mx-auto">
        @method('PUT')
        @csrf

        <div class="mb-8">
            <h2 class="text-2xl font-bold text-center">Edit Gearset</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 mb-4">
            {{-- gearset title --}}
            <div class="mb-4">
                <label for="gearset-title" class="block">Gearset title:</label>
                <input type="text" name="gearset-title" id="gearset-title" value="{{ $gearset->gearset_title }}" class="w-full rounded focus:ring-primary-400 focus:border-primary-400">
            </div>

            {{-- gearset desc --}}
            <div class="row-start-2 mb-4 md:mb-0">
                <label for="gearset-desc" class="block">Gearset description:</label>
                <textarea name="gearset-desc" id="gearset-desc" class="w-full rounded focus:ring-primary-400 focus:border-primary-400">{{ $gearset->gearset_desc }}</textarea>
            </div>

            {{-- gearset mode --}}
            <div class="row-span-2">
                <label for="mode" class="block">Game mode:</label>

                <div>
                    <input type="checkbox" name="gearset-mode-rm" value="1" @if($gearset->gearset_mode_rm) checked @endif class="rounded-sm text-secondary-700 focus:ring-primary-400">
                    <label for="gearset-mode-rm">Rainmaker</label>
                </div>

                <div>
                    <input type="checkbox" name="gearset-mode-cb" value="1" @if($gearset->gearset_mode_cb) checked @endif class="rounded-sm text-secondary-700 focus:ring-primary-400">
                    <label for="gearset-mode-cb">Clam Blitz</label>
                </div>

                <div>
                    <input type="checkbox" name="gearset-mode-sz" value="1" @if($gearset->gearset_mode_sz) checked @endif class="rounded-sm text-secondary-700 focus:ring-primary-400">
                    <label for="gearset-mode-sz">Splat Zones</label>
                </div>

                <div>
                    <input type="checkbox" name="gearset-mode-tc" value="1" @if($gearset->gearset_mode_tc) checked @endif class="rounded-sm text-secondary-700 focus:ring-primary-400">
                    <label for="gearset-mode-tc">Tower Control</label>
                </div>
            </div>
        </div>

        {{-- gears, skills, and stats --}}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
                {{-- gear (head) --}}
                <livewire:user-gear :userGears="$gears" gearType="Head" :oldGears="$gearset->gears->load(['baseGears'])" />
        
                {{-- gear (clothes) --}}
                <livewire:user-gear :userGears="$gears" gearType="Clothes" :oldGears="$gearset->gears->load(['baseGears'])" />
                
                {{-- gear (shoes) --}}
                <livewire:user-gear :userGears="$gears" gearType="Shoes" :oldGears="$gearset->gears->load(['baseGears'])" />
                
                {{-- submit --}}
                <input type="submit" value="Update" class="p-2 bg-transparent text-primary-700 rounded-md border border-primary-700 mb-2 cursor-pointer transition-colors hover:bg-primary-500 hover:text-white hover:border-primary-500">
            </div>
            
            {{-- gear stats --}}
            <div>
                <div class="mb-6">
                    <div id="weapons-container">
                        {{-- weapons search-select --}}
                        <livewire:weapon-search-select selectId="gearset-weapon-id" :oldWeaponId="$gearset->weapon_id" />
                    </div>
                    <div id="stats-container">
                        <h4>Gearset stats:</h4>

                        <div id="stats"></div>
                    </div>
                </div>
            </div>
        </div>

    </form>
@endsection

@section('scripts')
    @livewireScripts
@endsection