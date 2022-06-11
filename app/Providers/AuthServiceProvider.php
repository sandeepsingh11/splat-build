<?php

namespace App\Providers;

use App\Models\Gear;
use App\Models\Gearset;
use App\Policies\GearPolicy;
use App\Policies\GearsetPolicy;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Gear::class => GearPolicy::class,
        Gearset::class => GearsetPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        // https://laravel.com/docs/8.x/passwords#reset-link-customization
        // ResetPassword::createUrlUsing(function ($user, string $token) {
        //     return 'https://example.com/reset-password?token='.$token;
        // });
    }
}
