<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Barang extends Model
{
    protected $table = 'barang';
    protected $primaryKey = 'id_barang';
    public $timestamps = true;

    protected $fillable = [
        'id_kategori',
        'id_toko',
        'nama_barang',
        'deskripsi_barang',
        'harga_awal',
        'gambar_barang',
        'grade',
        'status_barang',
        'kondisi_detail',
        'berat_barang',
        'dimensi',
        'is_active',
        'is_deleted',
        'created_by',
        'updated_by'
    ];

    protected $appends = ['gambar_barang_url'];

    public function kategori()
    {
        return $this->belongsTo(Kategori::class, 'id_kategori', 'id_kategori');
    }

    public function toko()
    {
        return $this->belongsTo(Toko::class, 'id_toko', 'id_toko');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function getGambarBarangUrlAttribute()
    {
        if ($this->gambar_barang) {
            return asset('storage/' . $this->gambar_barang);
        }
        return null;
    }
}
