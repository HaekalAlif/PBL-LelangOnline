<?php

namespace App\Http\Requests\Toko;

use Illuminate\Foundation\Http\FormRequest;

class CreateTokoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama_toko' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'alamat' => 'required|string|max:255',
            'kontak' => 'required|string|max:50',
            'id_user' => 'required|integer|exists:users,id_user',
            'created_by' => 'required|integer|exists:users,id_user',
            'is_active' => 'required|boolean',
            'is_deleted' => 'required|boolean'
        ];
    }
}