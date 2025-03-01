<?php

namespace App\Http\Controllers\Penawaran;

use Illuminate\Foundation\Http\FormRequest;

class CreatePenawaranRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'id_lelang' => 'required|exists:lelang,id_lelang',
            'id_user' => 'required|exists:users,id_user',
            'harga_bid' => 'required|numeric|min:0',
        ];
    }
}
