<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\DocumentTypeResource;
use App\Http\Resources\UserResource;

class DocumentResource extends JsonResource
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
            'designation' => $this->designation,
            'document_type_id' => $this->document_type_id,
            'document_type' => new DocumentTypeResource($this->whenLoaded('documentType')),
            'document_date' => $this->document_date ? $this->document_date->format('Y-m-d') : null,
            'document_deposite_date' => $this->document_deposite_date ? $this->document_deposite_date->format('Y-m-d') : null,
            'is_privet' => $this->is_privet,
            'joiner_id' => $this->joiner_id,
            'joiner' => new UserResource($this->whenLoaded('joiner')),
            'description' => $this->description,
            'pdf_path' => $this->pdf_path,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
