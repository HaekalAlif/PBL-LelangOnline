<?php

namespace App\Http\Requests\Lelang;

use Illuminate\Foundation\Http\FormRequest;

class CreateLelangRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'id_barang' => 'required|exists:barang,id_barang',
            'tanggal_mulai' => 'required|date|after_or_equal:today',
            'tanggal_berakhir' => 'required|date|after:tanggal_mulai',
            'created_by' => 'required|exists:users,id_user',
            'harga_minimal_bid' => 'sometimes|numeric|min:0', // Optional, will use barang.harga_awal if not provided
            'status' => 'sometimes|in:berlangsung,selesai' // Updated enum values
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'status' => 'berlangsung', // Updated default status
            'created_by' => $this->user()->id_user ?? $this->input('created_by'),
            'updated_by' => $this->user()->id_user ?? $this->input('created_by')
        ]);
    }

    public function messages()
    {
        return [
            'id_barang.required' => 'Barang harus dipilih',
            'harga_minimal_bid.required' => 'Harga minimal bid harus diisi',
            'harga_minimal_bid.numeric' => 'Harga minimal bid harus berupa angka',
            'tanggal_mulai.required' => 'Tanggal mulai harus diisi',
            'tanggal_mulai.after_or_equal' => 'Tanggal mulai harus hari ini atau setelahnya',
            'tanggal_berakhir.required' => 'Tanggal berakhir harus diisi',
            'tanggal_berakhir.after' => 'Tanggal berakhir harus setelah tanggal mulai',
        ];
    }
}
