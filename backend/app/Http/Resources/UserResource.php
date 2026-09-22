<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'nom_ar' => $this->nom_ar,
            'nom_fr' => $this->nom_fr,
            'prenom_ar' => $this->prenom_ar,
            'prenom_fr' => $this->prenom_fr,
            'app_id' => $this->app_id,
            'role_id' => $this->role_id,
            'email' => $this->email,
            'etablissement_id' => $this->etablissement_id,
            'etablissement_designation' => $this->etablissement 
                ? ($this->etablissement->designation_fr ?? $this->etablissement->designation_ar) 
                : null,
            'rfid' => $this->rfid,
            'wilaya_id' => $this->wilaya_id,
            'wilaya_designation_ar' => $this->wilaya?->designation_ar,
            'wilaya_designation_fr' => $this->wilaya?->designation_fr,
            'commune_id' => $this->commune_id,
            'commune_designation_ar' => $this->commune?->designation_ar,
            'commune_designation_fr' => $this->commune?->designation_fr,
            'telephone' => $this->telephone,
            'state' => $this->state,
            'profession' => $this->profession,
            'joining_type_id' => $this->joining_type_id,
            'joining_type_designation' => $this->joiningType?->designation_ar,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
