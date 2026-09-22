<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'payment.employee_id' => 'required|exists:employees,id',
            'payment.open_date' => 'required|date',
            'payment.state' => ['nullable', Rule::in(['open','close'])],
            'payment.etablissement_id' => 'nullable|exists:etablissements,id',

            'line_payment' => 'sometimes|array',
            'line_payment.*.services_id' => 'nullable|exists:services,id', // service optional?
            'line_payment.*.designation_ar' => 'required_with:line_payment|string|max:255',
            'line_payment.*.designation_fr' => 'required_with:line_payment|string|max:255',
            'line_payment.*.type' => 'required_with:line_payment|string|max:100',
            'line_payment.*.percentage' => 'required_with:line_payment|integer|min:0|max:100',
            'line_payment.*.montant' => 'required_with:line_payment|numeric|min:0',
        ];
    }
}
