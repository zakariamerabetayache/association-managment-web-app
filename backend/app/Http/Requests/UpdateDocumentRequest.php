<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDocumentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'designation' => 'sometimes|string|max:255',
            'document_type_id' => 'sometimes|exists:document_types,id',
            'document_date' => 'nullable|date',
            'document_deposite_date' => 'nullable|date',
            'is_privet' => 'boolean',
            'joiner_id' => 'required_if:is_privet,true|nullable|exists:users,id',
            'description' => 'nullable|string',
            'file' => 'nullable|file|mimes:pdf|max:10240',
        ];
    }
}
