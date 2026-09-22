<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EtablissementResource extends JsonResource
{
    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'designation_ar' => $this->designation_ar,
            'designation_fr' => $this->designation_fr,
            'logo' => $this->logo,
            'wilaya_id' => $this->wilaya_id,
            'commune_id' => $this->commune_id,
            'owner_name_ar' => $this->owner_name_ar,
            'owner_name_fr' => $this->owner_name_fr,
            'owner_last_name_ar' => $this->owner_last_name_ar,
            'owner_last_name_fr' => $this->owner_last_name_fr,
            'rip' => $this->rip,
            'price' => $this->price,
            'adress' => $this->adress,
            'phone' => $this->phone,
            'email' => $this->email,
            'opening_hour' => $this->opening_hour,
            'closing_hour' => $this->closing_hour,
            'is_validation' => $this->is_validation,
            'wilaya_designation_ar' => $this->whenLoaded('wilaya', function () {
                return $this->wilaya->designation_ar;
            }),
            'wilaya_designation_fr' => $this->whenLoaded('wilaya', function () {
                return $this->wilaya->designation_fr;
            }),
            'commune_designation_ar' => $this->whenLoaded('commune', function () {
                return $this->commune->designation_ar;
            }),
            'commune_designation_fr' => $this->whenLoaded('commune', function () {
                return $this->commune->designation_fr;
            }),
            'users_count' => $this->whenLoaded('users', function () {
                return $this->users->count();
            }),
            'joiners_count' => $this->joiners_count,
            'wilaya' => $this->whenLoaded('wilaya'),
            'commune' => $this->whenLoaded('commune'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
