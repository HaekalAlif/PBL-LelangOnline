<?php

namespace App\Http\Requests\Barang;

use Illuminate\Foundation\Http\FormRequest;

class CreateBarangRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'id_kategori' => 'required|exists:kategori,id_kategori,is_deleted,0,is_active,1',
            'id_toko' => 'required|exists:toko,id_toko,is_deleted,0',
            'nama_barang' => 'required|string|max:255',
            'deskripsi_barang' => 'required|string',
            'harga_awal' => 'required|numeric|min:0',
            'gambar_barang' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            'grade' => 'required|string|in:A,B,C,D',
            'status_barang' => 'nullable|string|in:tersedia,dalam_lelang,terjual',
            'kondisi_detail' => 'required|string',
            'berat_barang' => 'required|numeric|min:0',
            'dimensi' => 'required|string',
        ];
    }

    public function messages()
    {
        return [
            'id_kategori.required' => 'Kategori harus dipilih',
            'id_kategori.exists' => 'Kategori tidak valid atau tidak aktif',
            'id_toko.required' => 'Toko harus dipilih',
            'id_toko.exists' => 'Toko tidak valid atau tidak aktif',
            'nama_barang.required' => 'Nama barang harus diisi',
            'deskripsi_barang.required' => 'Deskripsi barang harus diisi',
            'harga_awal.required' => 'Harga awal harus diisi',
            'harga_awal.numeric' => 'Harga awal harus berupa angka',
            'gambar_barang.required' => 'Gambar barang harus diupload',
            'gambar_barang.image' => 'File harus berupa gambar',
            'gambar_barang.mimes' => 'Format gambar harus jpeg, png, jpg, atau webp',
            'gambar_barang.max' => 'Ukuran gambar maksimal 2MB',
            'grade.required' => 'Grade harus dipilih',
            'grade.in' => 'Grade tidak valid',
            'kondisi_detail.required' => 'Kondisi detail harus diisi',
            'berat_barang.required' => 'Berat barang harus diisi',
            'berat_barang.numeric' => 'Berat barang harus berupa angka',
            'dimensi.required' => 'Dimensi harus diisi',
        ];
    }
}
