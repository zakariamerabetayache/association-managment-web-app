<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;

use App\Http\Requests\StoreDocumentRequest;
use App\Http\Requests\UpdateDocumentRequest;
use App\Http\Resources\DocumentResource;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Document::with(['documentType', 'joiner']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('designation', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('document_type_id') && !empty($request->document_type_id)) {
            $query->where('document_type_id', $request->document_type_id);
        }

        if ($request->has('document_date') && !empty($request->document_date)) {
            $query->whereDate('document_date', $request->document_date);
        }

        if ($request->has('is_privet') && $request->is_privet !== '') {
            $query->where('is_privet', $request->is_privet);
        }

        if ($request->has('joiner_id') && !empty($request->joiner_id)) {
            $query->where('joiner_id', $request->joiner_id);
        }

        return DocumentResource::collection($query->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDocumentRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('documents', 'public');
            $data['pdf_path'] = $path;
        }

        $document = Document::create($data);
        return new DocumentResource($document->load(['documentType', 'joiner']));
    }

    /**
     * Display the specified resource.
     */
    public function show(Document $document)
    {
        return new DocumentResource($document->load(['documentType', 'joiner']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDocumentRequest $request, Document $document)
    {
        $data = $request->validated();

        if ($request->hasFile('file')) {
            // Delete old file
            if ($document->pdf_path) {
                Storage::delete('public/' . $document->pdf_path);
            }
            $path = $request->file('file')->store('documents', 'public');
            $data['pdf_path'] = $path;
        }

        $document->update($data);
        return new DocumentResource($document->load(['documentType', 'joiner']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        if ($document->pdf_path) {
            Storage::delete('public/' . $document->pdf_path);
        }
        $document->delete();
        return response()->noContent();
    }
}
