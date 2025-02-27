<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
    protected $table = 'kategori';
    protected $primaryKey = 'id_kategori';
    
    protected $fillable = [
        'nama_kategori',
        'deskripsi',
        'is_active',
        'is_deleted',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_deleted' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relationship with User for created_by
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by', 'id_user');
    }

    // Relationship with User for updated_by
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id_user');
    }

    // Relationship with Barang
    public function barang()
    {
        return $this->hasMany(Barang::class, 'id_kategori', 'id_kategori');
    }
}