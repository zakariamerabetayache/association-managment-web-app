<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DocumentType;
use Illuminate\Http\Request;

use App\Http\Requests\StoreDocumentTypeRequest;
use App\Http\Requests\UpdateDocumentTypeRequest;
use App\Http\Resources\DocumentTypeResource;

class DocumentTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = DocumentType::query();

        if ($request->search) {
            $query->where('designation_ar', 'like', '%' . $request->search . '%')
                  ->orWhere('designation_fr', 'like', '%' . $request->search . '%');
        }

        return DocumentTypeResource::collection($query->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDocumentTypeRequest $request)
    {
        $documentType = DocumentType::create($request->validated());
        return new DocumentTypeResource($documentType);
    }

    /**
     * Display the specified resource.
     */
    public function show(DocumentType $documentType)
    {
        return new DocumentTypeResource($documentType);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDocumentTypeRequest $request, DocumentType $documentType)
    {
        $documentType->update($request->validated());
        return new DocumentTypeResource($documentType);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DocumentType $documentType)
    {
        $documentType->delete();
        return response()->noContent();
    }
}
