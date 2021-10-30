@extends('layouts.app')

@section('content')
    <div class="flex justify-center items-center min-h-screen">
        <div class="lg:w-4/12 md:w-8/12 w-11/12 bg-white my-4 p-6 rounded-lg shadow-md">
            <div id="registration-header">
                <h1 class="mb-6 text-3xl font-bold text-center">Registration</h1>
            </div>

            <form action="{{ route('register') }}" method="post">
                @csrf

                <div class="mb-5">
                    <x-label for="username" value="Username" />
                    <x-input id="username" class="block mt-1 w-full" type="text" name="username" :value="old('username')" required autofocus />

                    @error('username')
                        <div class="text-red-500 mt-2 text-sm">
                            {{ $message }}
                        </div>
                    @enderror
                </div>

                <div class="mb-5">
                    <x-label for="email" value="Email" />
                    <x-input id="email" class="block mt-1 w-full" type="email" name="email" :value="old('email')" required />
                    <div class="text-sm text-gray-500">Used for password resets</div>

                    @error('email')
                        <div class="text-red-500 mt-2 text-sm">
                            {{ $message }}
                        </div>
                    @enderror
                </div>

                <div class="mb-5">
                    <x-label for="password" value="Password" />
                    <x-input id="password" class="block mt-1 w-full" type="password" name="password" required />

                    @error('password')
                        <div class="text-red-500 mt-2 text-sm">
                            {{ $message }}
                        </div>
                    @enderror
                </div>

                <div class="mb-5">
                    <x-label for="password_confirmation" value="Retype password" />
                    <x-input id="password_confirmation" class="block mt-1 w-full" type="password" name="password_confirmation" required />
                </div>

                <div class="mb-6">
                    <x-button text="Register" />
                </div>
            </form>

            <div class="text-center">
                <x-link link="{{ route('login') }}" text="Have an account? Login here" class="text-sm opacity-75" />
            </div>
        </div>
    </div>
@endsection