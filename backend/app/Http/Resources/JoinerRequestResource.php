<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JoinerRequestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'joiner_id' => $this->joiner_id,
            'user_id' => $this->user_id,
            'description' => $this->description,
            'type' => $this->type,
            'state' => $this->state,
            'pdf_path' => $this->pdf_path,
            'pdf_state' => $this->pdf_state,
            'created_at' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : null,
            'updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d H:i:s') : null,
            
            // Relationships
            'joiner' => $this->whenLoaded('joiner'),
            'user' => $this->whenLoaded('user'),
        ];
    }
}
