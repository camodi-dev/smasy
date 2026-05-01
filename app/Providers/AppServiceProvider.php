<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->ensureAdminExists();
    }

    private function ensureAdminExists(): void
    {
        try {
            $adminEmail = env('ADMIN_EMAIL', 'admin@institute.com');

            if (!User::where('email', $adminEmail)->exists()) {
                User::create([
                    'name'     => 'Super Admin',
                    'email'    => $adminEmail,
                    'password' => Hash::make(env('ADMIN_PASSWORD', 'Admin@1234')),
                    'role'     => 'admin',
                ]);
            }
        } catch (\Throwable $e) {
            // Silently fail if DB is not ready yet
        }
    }
}