<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lelang extends Model
{
    use HasFactory;

    protected $table = 'lelang';
    protected $primaryKey = 'id_lelang';

    protected $fillable = [
        'id_barang',
        'id_pemenang',
        'id_penawaran_tertinggi',
        'harga_pemenang',
        'harga_minimal_bid',
        'tanggal_mulai',
        'tanggal_berakhir',
        'status',
        'jumlah_bid',
        'is_deleted',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'harga_pemenang' => 'double',
        'harga_minimal_bid' => 'double',
        'tanggal_mulai' => 'datetime',
        'tanggal_berakhir' => 'datetime',
        'jumlah_bid' => 'integer',
        'is_deleted' => 'boolean',
        'status' => 'string'
    ];

    // Relationships
    public function barang()
    {
        return $this->belongsTo(Barang::class, 'id_barang', 'id_barang');
    }

    public function pemenang()
    {
        return $this->belongsTo(User::class, 'id_pemenang', 'id_user');
    }

    public function penawaranTertinggi()
    {
        return $this->belongsTo(Penawaran::class, 'id_penawaran_tertinggi', 'id_penawaran');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by', 'id_user');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by', 'id_user');
    }

    // Add this relationship
    public function penawaran()
    {
        return $this->hasMany(Penawaran::class, 'id_lelang', 'id_lelang');
    }

    // Scope for non-deleted records
    public function scopeActive($query)
    {
        return $query->where('is_deleted', false);
    }
}
