<?php

namespace App\Http\Requests\Kategori;

use Illuminate\Foundation\Http\FormRequest;

class CreateKategoriRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nama_kategori' => 'required|string|max:255|unique:kategori,nama_kategori,NULL,id_kategori,is_deleted,0',
            'is_active' => 'boolean'
        ];
    }
}