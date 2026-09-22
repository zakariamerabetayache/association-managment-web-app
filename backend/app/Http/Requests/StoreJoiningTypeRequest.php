<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJoiningTypeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'designation_ar' => 'required|string|max:255',
            'designation_fr' => 'required|string|max:255',
            'card_validity' => 'required|integer|in:1,2,3',
            'enrollment_code' => 'required|integer|in:0,1,2,3',
        ];
    }
}
