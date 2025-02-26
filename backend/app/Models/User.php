<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    const ROLE_SUPERADMIN = 0;
    const ROLE_ADMIN = 1;
    const ROLE_USER = 2;
    

    public static $roles = [
        self::ROLE_SUPERADMIN => 'superadmin',
        self::ROLE_ADMIN => 'admin',
        self::ROLE_USER => 'user',
        
    ];

    protected $primaryKey = 'id_user';
    
    protected $fillable = [
        'username',
        'email',
        'password',
        'no_hp',
        'foto_profil',
        'tanggal_lahir',
        'role',
        'poin_reputasi',
        'is_verified',
        'is_active',
        'is_deleted',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'password' => 'hashed',
        'tanggal_lahir' => 'date',
        'is_verified' => 'boolean',
        'is_active' => 'boolean',
        'is_deleted' => 'boolean',
        'role' => 'integer'
    ];

    public function getRoleNameAttribute()
    {
        return self::$roles[$this->role] ?? 'unknown';
    }
}