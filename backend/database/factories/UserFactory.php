<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    protected $model = User::class;
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'username' => fake()->userName(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => User::ROLE_USER,
            'no_hp' => fake()->phoneNumber(),
            'tanggal_lahir' => fake()->date(),
            'poin_reputasi' => fake()->numberBetween(0, 100),
            'is_verified' => true,
            'is_active' => true,
            'is_deleted' => false,
        ];
    }
}