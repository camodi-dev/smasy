<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $adminEmail = env('ADMIN_EMAIL', 'admin@institute.com');

        if (!User::where('email', $adminEmail)->exists()) {
            User::create([
                'name'     => 'Super Admin',
                'email'    => $adminEmail,
                'password' => Hash::make(env('ADMIN_PASSWORD', 'Admin@1234')),
                'role'     => 'admin',
            ]);
        }
    }
}