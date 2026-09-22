<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'current_payment_number' => 'sometimes|required|integer',
            'year' => 'sometimes|required|integer|min:2000|max:2100',
            'month' => 'sometimes|required|string|max:20',
            'employee_id' => 'sometimes|required|exists:employees,id',
            'open_date' => 'nullable|date',
            'state' => ['nullable', Rule::in(['open','close'])],
            'etablissement_id' => 'nullable|exists:etablissements,id',

            'lines' => 'sometimes|array',
            'lines.*.id' => 'sometimes|integer|exists:line_payments,id',
            'lines.*.services_id' => 'nullable|exists:services,id',
            'lines.*.designation_ar' => 'required_with:lines|string|max:255',
            'lines.*.designation_fr' => 'required_with:lines|string|max:255',
            'lines.*.type' => 'required_with:lines|string|max:100',
            'lines.*.percentage' => 'required_with:lines|integer|min:0|max:100',
            'lines.*.montant' => 'required_with:lines|numeric|min:0',
        ];
    }
}
