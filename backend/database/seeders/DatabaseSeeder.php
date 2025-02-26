<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin
        User::factory()->create([
            'username' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_SUPERADMIN,
            'no_hp' => '081234567890',
            'tanggal_lahir' => '1990-01-01',
            'poin_reputasi' => 100,
            'is_verified' => true,
            'is_active' => true,
            'is_deleted' => false
        ]);

        // Admin
        User::factory()->create([
            'username' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_ADMIN,
            'no_hp' => '081234567891',
            'tanggal_lahir' => '1991-01-01',
            'poin_reputasi' => 80,
            'is_verified' => true,
            'is_active' => true,
            'is_deleted' => false
        ]);

        // Regular User
        User::factory()->create([
            'username' => 'User',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_USER,
            'no_hp' => '081234567892',
            'tanggal_lahir' => '1992-01-01',
            'poin_reputasi' => 50,
            'is_verified' => true,
            'is_active' => true,
            'is_deleted' => false
        ]);
    }
}