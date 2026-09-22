<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEtablissementRequest extends FormRequest
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
            'designation_ar' => 'required|string|max:255|regex:/^[\p{Arabic}\s]+$/u',
            'designation_fr' => 'required|string|max:255|regex:/^[\p{Latin}\s\'\-\.]+$/u',
            'logo' => 'nullable|string|max:500',
            'wilaya_id' => 'nullable|integer|exists:wilayas,id',
            'commune_id' => 'nullable|integer|exists:communes,id',
            'owner_name_ar' => 'nullable|string|max:255|regex:/^[\p{Arabic}\s]*$/u',
            'owner_name_fr' => 'nullable|string|max:255|regex:/^[\p{Latin}\s\'\-\.]*$/u',
            'owner_last_name_ar' => 'nullable|string|max:255|regex:/^[\p{Arabic}\s]*$/u',
            'owner_last_name_fr' => 'nullable|string|max:255|regex:/^[\p{Latin}\s\'\-\.]*$/u',
            'rip' => 'nullable|string|max:20',
            'price' => 'nullable|numeric|min:0',
            'adress' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'opening_hour' => 'nullable',
            'closing_hour' => 'nullable',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'designation_ar.required' => 'الاسم بالعربية مطلوب',
            'designation_ar.string' => 'الاسم بالعربية يجب أن يكون نص',
            'designation_ar.max' => 'الاسم بالعربية يجب أن يكون أقل من 255 حرف',
            'designation_fr.required' => 'الاسم بالفرنسية مطلوب',
            'designation_fr.string' => 'الاسم بالفرنسية يجب أن يكون نص',
            'designation_fr.max' => 'الاسم بالفرنسية يجب أن يكون أقل من 255 حرف',
            'logo.string' => 'الشعار يجب أن يكون نص',
            'logo.max' => 'مسار الشعار يجب أن يكون أقل من 500 حرف',
            'wilaya_id.required' => 'الولاية مطلوبة',
            'wilaya_id.integer' => 'معرف الولاية يجب أن يكون رقم صحيح',
            'wilaya_id.exists' => 'الولاية المحددة غير موجودة',
            'commune_id.required' => 'البلدية مطلوبة',
            'commune_id.integer' => 'معرف البلدية يجب أن يكون رقم صحيح',
            'commune_id.exists' => 'البلدية المحددة غير موجودة',
            'owner_name_ar.string' => 'اسم المالك بالعربية يجب أن يكون نص',
            'owner_name_ar.max' => 'اسم المالك بالعربية يجب أن يكون أقل من 255 حرف',
            'owner_name_fr.string' => 'اسم المالك بالفرنسية يجب أن يكون نص',
            'owner_name_fr.max' => 'اسم المالك بالفرنسية يجب أن يكون أقل من 255 حرف',
            'owner_last_name_ar.string' => 'لقب المالك بالعربية يجب أن يكون نص',
            'owner_last_name_ar.max' => 'لقب المالك بالعربية يجب أن يكون أقل من 255 حرف',
            'owner_last_name_fr.string' => 'لقب المالك بالفرنسية يجب أن يكون نص',
            'owner_last_name_fr.max' => 'لقب المالك بالفرنسية يجب أن يكون أقل من 255 حرف',
            'rip.string' => 'رقم التعريف الضريبي يجب أن يكون نص',
            'rip.max' => 'رقم التعريف الضريبي يجب أن يكون أقل من 20 حرف',
            'price.numeric' => 'السعر يجب أن يكون رقم',
            'price.min' => 'السعر يجب أن يكون موجباً',
            'adress.string' => 'العنوان يجب أن يكون نص',
            'adress.max' => 'العنوان يجب أن يكون أقل من 500 حرف',
            'phone.string' => 'رقم الهاتف يجب أن يكون نص',
            'phone.max' => 'رقم الهاتف يجب أن يكون أقل من 20 حرف',
            'email.email' => 'البريد الإلكتروني غير صحيح',
            'email.max' => 'البريد الإلكتروني يجب أن يكون أقل من 255 حرف',
            'designation_ar.regex' => 'اسم المؤسسة بالعربية يجب أن يحتوي على أحرف عربية فقط',
            'designation_fr.regex' => 'اسم المؤسسة بالفرنسية يجب أن يحتوي على أحرف لاتينية فقط',
            'owner_name_ar.regex' => 'اسم المالك بالعربية يجب أن يحتوي على أحرف عربية فقط',
            'owner_name_fr.regex' => 'اسم المالك بالفرنسية يجب أن يحتوي على أحرف لاتينية فقط',
            'owner_last_name_ar.regex' => 'لقب المالك بالعربية يجب أن يحتوي على أحرف عربية فقط',
            'owner_last_name_fr.regex' => 'لقب المالك بالفرنسية يجب أن يحتوي على أحرف لاتينية فقط',
            'opening_hour.date_format' => 'ساعة الافتتاح يجب أن تكون بصيغة صحيحة (HH:MM)',
            'closing_hour.date_format' => 'ساعة الإغلاق يجب أن تكون بصيغة صحيحة (HH:MM)',
        ];
    }
}
