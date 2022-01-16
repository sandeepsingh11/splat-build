<nav class="relative bg-primary-500 text-white flex justify-between">
    <ul class="flex items-center">
        <x-nav-link link="{{ route('home') }}" text="SB" />
    </ul>

    {{-- desktop menu --}}
    <ul class="md:flex items-center hidden">
        @auth
            <x-nav-link link="{{ route('gears.create') }}" text="+Gear" />
            <x-nav-link link="{{ route('gearsets.create') }}" text="+Gearset" />

            {{-- dropdown container --}}
            <div x-data="{ open: false }" class="relative">
                <button 
                    @click="open = true" 
                    @mouseenter="open = true"
                    class="block p-3 hover:bg-primary-600 focus:hover:bg-primary-600 transition-colors"
                >
                    Profile
                </button>
            
                {{-- dropdown --}}
                <ul
                    x-show.transition="open"
                    @click.away="open = false"
                    @mouseleave="open = false"
                    class="absolute top-full right-0 bg-primary-500 mt-1 rounded text-left z-20"
                    style="display: none"
                >
                    <x-nav-link link="{{ route('dashboard') }}" text="Dashboard" class="py-2 px-4 rounded-t-md" />
                    <x-nav-link link="{{ route('gears') }}" text="Gears" class="py-2 px-4" />
                    <x-nav-link link="{{ route('gearsets') }}" text="Gearsets" class="py-2 px-4" />
                    {{-- <x-nav-link link="{{ route('settings') }}" text="Settings" class="py-2 px-4" /> --}}
                    <li>
                        <form action="{{ route('logout') }}" method="post">
                            @csrf
                            <button type="submit" class="w-full py-2 px-4 text-left rounded-b-md hover:bg-primary-600 focus:hover:bg-primary-600 transition-colors">Logout</button>
                        </form>
                    </li>
                </ul>
            </div>
        @endauth

        @guest
            <x-nav-link link="{{ route('login') }}" text="Login" />
            <x-nav-link link="{{ route('register') }}" text="Register" />
        @endguest
    </ul>



    {{-- mobile menu --}}
    <ul class="md:hidden items-center flex">
        {{-- dropdown container --}}
        <div x-data="{ open: false }">
            <button 
                @click="open = true" 
                class="block p-3 hover:bg-primary-600 focus:hover:bg-primary-600 transition-colors"
            >
                <div x-show="!open">
                    <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </div>
                <div x-show="open">
                    <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </button>

            {{-- dropdown --}}
            <ul
                x-show.transition="open"
                @click.away="open = false"
                class="absolute top-full left-0 flex flex-col justify-evenly w-screen bg-primary-500 text-center z-20"
                style="display: none"
            >
                @auth
                    <x-nav-link link="{{ route('gears.create') }}" text="+Gear" />
                    <x-nav-link link="{{ route('gearsets.create') }}" text="+Gearset" />
                    <x-nav-link link="{{ route('dashboard') }}" text="Dashboard" />
                    <x-nav-link link="{{ route('gears') }}" text="Gears" />
                    <x-nav-link link="{{ route('gearsets') }}" text="Gearsets" />
                    {{-- <x-nav-link link="{{ route('settings') }}" text="Settings" /> --}}
                    <li>
                        <form action="{{ route('logout') }}" method="post">
                            @csrf
                            <button type="submit" class="w-full p-3 hover:bg-primary-600 focus:hover:bg-primary-600 transition-colors">Logout</button>
                        </form>
                    </li>
                @endauth

                @guest
                    <x-nav-link link="{{ route('login') }}" text="Login" />
                    <x-nav-link link="{{ route('register') }}" text="Register" />
                @endguest
            </ul>
        </div>
    </ul>
</nav>