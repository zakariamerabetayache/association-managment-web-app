<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
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
        $roleId = $this->input('role_id', -1);
        
        $rules = [
            'nom_ar' => 'required|string|max:255|regex:/^[\p{Arabic}\s]+$/u',
            'nom_fr' => 'required|string|max:255|regex:/^[\p{Latin}\s\'\-\.]+$/u',
            'prenom_ar' => 'required|string|max:255|regex:/^[\p{Arabic}\s]+$/u',
            'prenom_fr' => 'required|string|max:255|regex:/^[\p{Latin}\s\'\-\.]+$/u',
            'app_id' => 'required|integer',
            'role_id' => 'required|string|in:admin,national,wilaya,baladi,joiner,printer',
            'rfid' => 'nullable|string|max:255|unique:users,rfid',
            'self_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'wilaya_id' => 'sometimes|required|integer|exists:wilayas,id',
            'commune_id' => 'required|integer|exists:communes,id',
            'profession' => 'nullable|string|max:255',
            'joining_type_id' => 'nullable|integer|exists:joining_types,id',
        ];
        
        // Add email and password validation for all roles including companions
        $rules += [
            'email' => 'required|string|email|unique:users,email',
            'password' => ['required', 'string', 'min:6'],
        ];
        
        if ($roleId != 'admin') {
            $rules += [
                'etablissement_id' => 'required|integer|exists:etablissements,id',
            ];
        }
        
        return $rules;
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nom_ar.regex' => 'الاسم بالعربية يجب أن يحتوي على أحرف عربية فقط',
            'nom_fr.regex' => 'الاسم بالفرنسية يجب أن يحتوي على أحرف لاتينية فقط',
            'prenom_ar.regex' => 'اللقب بالعربية يجب أن يحتوي على أحرف عربية فقط',
            'prenom_fr.regex' => 'اللقب بالفرنسية يجب أن يحتوي على أحرف لاتينية فقط',
            'wilaya_id.required' => 'الولاية مطلوبة',
            'wilaya_id.exists' => 'الولاية المحددة غير موجودة',
            'commune_id.required' => 'البلدية مطلوبة',
            'commune_id.exists' => 'البلدية المحددة غير موجودة',
        ];
    }
}
