@extends('layouts.app')

@section('scripts-head')
    <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.8.2/dist/alpine.min.js" defer></script>
@endsection

@section('styles')
    @livewireStyles
@endsection

@section('content')
    @foreach ($errors->all() as $message)
        <h1>{{ $message }}</h1>
    @endforeach

    {{-- form --}}
    <form action="{{ route('gears.update', $gear) }}" method="post" class="w-full md:w-1/2 lg:w-4/5 px-4 md:px-0 md:mx-auto">
        @method('PUT')
        @csrf

        <div class="mb-8">
            <h2 class="text-2xl font-bold text-center">Edit Gear</h2>
        </div>

        {{-- gear name --}}
        <div class="mb-4 lg:w-2/5 mx-auto">
            <label for="gear-title" class="block">Gear name:</label>
            <input type="text" name="gear-title" id="gear-name" value="{{ $gear->gear_title }}" class="w-full rounded focus:ring-primary-400 focus:border-primary-400">
        </div>

        {{-- gear desc --}}
        <div class="mb-4 lg:w-2/5 mx-auto">
            <label for="gear-desc" class="block">Gear description:</label>
            <textarea name="gear-desc" id="gear-desc" cols="30" rows="3" class="w-full rounded focus:ring-primary-400 focus:border-primary-400">{{ $gear->gear_desc }}</textarea>
        </div>


        {{-- gear, skills, and stats --}}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
                {{-- gear and skills selector --}}
                <div class="mb-6">
                    <x-gear.gear-skills-builder 
                        :gearName="$gear->baseGears->base_gear_name"
                        :gearSkillIds="$gearSkillIds" 
                        :gearSkillNames="$gearSkillNames" 
                        :gears="$baseGears" 
                        :skills="$skills" 
                    />
                </div>
    
                {{-- submit --}}
                <input type="submit" class="p-2 bg-transparent text-primary-700 rounded-md border border-primary-700 mb-2 cursor-pointer transition-colors hover:bg-primary-500 hover:text-white hover:border-primary-500" value="Update">
            </div>

            {{-- gear stats --}}
            <div>
                <div class="mb-6">
                    <div id="weapons-container">
                        {{-- weapons search-select --}}
                        <livewire:weapon-search-select label="Test weapon:" />
                    </div>
                    <div id="stats-container">
                        <h4>Gear stats:</h4>

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