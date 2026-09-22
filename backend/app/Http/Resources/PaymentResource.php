<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public static $wrap = false;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'current_payment_number' => $this->current_payment_number,
            'year' => $this->year,
            'month' => $this->month,
            'state' => $this->state,
            'open_date' => $this->open_date ? $this->open_date->format('Y-m-d') : null,
            'etablissement_id' => $this->etablissement_id,
            'employee_id' => $this->employee_id,
            'employee' => $this->whenLoaded('employee', function () {
                 return [
                    'id' => $this->employee->id,
                    'nom_ar' => $this->employee->nom_ar ?? null,
                    'nom_fr' => $this->employee->nom_fr ?? null,
                    'prenom_ar' => $this->employee->prenom_ar ?? null,
                    'prenom_fr' => $this->employee->prenom_fr ?? null,
                 ];
            }),
            'lines' => LinePaymentResource::collection($this->whenLoaded('lines')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
