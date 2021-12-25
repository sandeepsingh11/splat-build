@extends('layouts.app')

@section('content')

    <h2 class="text-2xl font-bold text-center mb-8">{{ $user->username }}'s gearsets</h2>

    @if ($gearsets->count())
        <div class="grid grid-cols-1 w-full lg:w-10/12 xl:w-11/12 mx-auto mb-8 px-4 md:px-8">
            @foreach ($gearsets as $gearset)

                <a href="{{ route('gearsets.show', $gearset) }}" class="h-full mb-6">
                    {{-- gearset component --}}
                    <x-gearset.base :gearset="$gearset" :user="$user" />
                </a>
                
            @endforeach
        </div>
    @else
        <p class="text-xl text-center italic font-semibold">{{ $user->username }} does not have any gearsets yet...</p>
    @endif
@endsection