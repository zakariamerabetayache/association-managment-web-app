<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JoinerRequest;
use App\Http\Resources\JoinerRequestResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class JoinerRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = JoinerRequest::with(['joiner', 'user']);
        $currentUser = $request->user();

        if (!$currentUser) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        // Apply role-based filtering
        switch ($currentUser->role_id) {
            case 'admin':
            case 'national':
            case 'printer':
                // Sees all requests
                break;

            case 'wilaya':
                // Sees requests for joiners in the same wilaya
                $query->whereHas('joiner', function ($q) use ($currentUser) {
                    $q->where('wilaya_id', $currentUser->wilaya_id);
                });
                break;

            case 'baladi':
                // Sees requests for joiners in the same wilaya and commune
                $query->whereHas('joiner', function ($q) use ($currentUser) {
                    $q->where('wilaya_id', $currentUser->wilaya_id)
                        ->where('commune_id', $currentUser->commune_id);
                });
                break;

            case 'joiner':
                // Joiners only see their own requests (where they are the 'joiner_id')
                $query->where('joiner_id', $currentUser->id);
                break;

            default:
                // Default to showing only requests created by user
                $query->where('user_id', $currentUser->id);
                break;
        }

        // Additional filters if provided in request
        if ($request->has('joiner_id') && !empty($request->joiner_id)) {
            $query->where('joiner_id', $request->joiner_id);
        }

        if ($request->has('user_id') && !empty($request->user_id)) {
            $query->where('user_id', $request->user_id);
        }
        // Search by joiner name (nom_ar + prenom_ar)
        if ($request->has('search') && $request->search) {
            $searchTerm = $request->search;
            $query->whereHas('joiner', function($q) use ($searchTerm) {
                $q->whereRaw("CONCAT(nom_ar, ' ', prenom_ar) LIKE ?", ["%{$searchTerm}%"])
                  ->orWhereRaw("CONCAT(prenom_ar, ' ', nom_ar) LIKE ?", ["%{$searchTerm}%"])
                  ->orWhere('email', 'LIKE', "%{$searchTerm}%");
            });
        }
        
        // Filter by type
        if ($request->has('type') && $request->type !== null) {
            $query->where('type', $request->type);
        }
        
        // Filter by state
        if ($request->has('state') && $request->state !== null) {
            $query->where('state', $request->state);
        }
        
        // Pagination
        $perPage = $request->get('per_page', 10);
        $joinerRequests = $query->orderBy('created_at', 'desc')->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => JoinerRequestResource::collection($joinerRequests->items()),
            'meta' => [
                'current_page' => $joinerRequests->currentPage(),
                'per_page' => $joinerRequests->perPage(),
                'total' => $joinerRequests->total(),
                'last_page' => $joinerRequests->lastPage(),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'description' => 'required|string|max:1000',
            'joiner_id' => 'required|exists:users,id',
            'user_id' => 'required|exists:users,id',
            'type' => 'required|integer|in:0,1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $joinerRequest = JoinerRequest::create([
            'description' => $request->description,
            'joiner_id' => $request->joiner_id,
            'user_id' => $request->user_id,
            'type' => $request->type,
            'state' => 0, // Default state: sent
            'pdf_state' => 0, // Default PDF state: not uploaded
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء الطلب بنجاح',
            'data' => new JoinerRequestResource($joinerRequest->load(['joiner', 'user']))
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(JoinerRequest $joinerRequest)
    {
        return response()->json([
            'success' => true,
            'data' => new JoinerRequestResource($joinerRequest->load(['joiner', 'user']))
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JoinerRequest $joinerRequest)
    {
        $validator = Validator::make($request->all(), [
            'description' => 'sometimes|required|string|max:1000',
            'type' => 'sometimes|required|integer|in:0,1',
            'state' => 'sometimes|required|integer|in:0,1,2',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $joinerRequest->update($request->only(['description', 'type', 'state']));

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث الطلب بنجاح',
            'data' => new JoinerRequestResource($joinerRequest->load(['joiner', 'user']))
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JoinerRequest $joinerRequest)
    {
        // Delete PDF file if exists
        if ($joinerRequest->pdf_path && Storage::exists($joinerRequest->pdf_path)) {
            Storage::delete($joinerRequest->pdf_path);
        }
        
        $joinerRequest->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف الطلب بنجاح'
        ]);
    }

    /**
     * Upload PDF for joiner request
     */
    public function uploadPdf(Request $request, JoinerRequest $joinerRequest)
    {
        $validator = Validator::make($request->all(), [
            'pdf' => 'required|file|mimes:pdf|max:10240', // Max 10MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Delete old PDF if exists
        if ($joinerRequest->pdf_path && Storage::exists($joinerRequest->pdf_path)) {
            Storage::delete($joinerRequest->pdf_path);
        }

        // Store new PDF
        $path = $request->file('pdf')->store('joiner_requests', 'public');
        
        $joinerRequest->update([
            'pdf_path' => $path,
            'pdf_state' => 1 // PDF uploaded
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم رفع الملف بنجاح',
            'data' => new JoinerRequestResource($joinerRequest->load(['joiner', 'user']))
        ]);
    }

    /**
     * Update PDF state
     */
    public function updatePdfState(Request $request, JoinerRequest $joinerRequest)
    {
        $validator = Validator::make($request->all(), [
            'pdf_state' => 'required|integer|in:0,1,2',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $joinerRequest->update([
            'pdf_state' => $request->pdf_state
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث حالة الملف بنجاح',
            'data' => new JoinerRequestResource($joinerRequest->load(['joiner', 'user']))
        ]);
    }

    /**
     * Get all joiner requests for joiners in a specific establishment (Admin view)
     * Route: GET /joiner-requests/establishment/{etablissement_id}
     */
    public function getByEstablishment($etablissementId, Request $request)

    {
        $user = Auth::user();
        try {
            // Validate the establishment exists
            $etablissement = \App\Models\Etablissement::find($etablissementId);
            if (!$etablissement) {
                return response()->json([
                    'message' => 'Establishment not found',
                    'data' => [],
                    'current_page' => 1,
                    'per_page' => 10,
                    'total' => 0,
                    'last_page' => 1
                ], 404);
            }

            // Start query: joiner requests for joiners in this establishment
            $query = JoinerRequest::whereHas('joiner', function ($joinerQuery) use ($etablissementId, $user) {
                $joinerQuery->where('etablissement_id', $etablissementId);
                if ($user->role_id === 'wilaya') {
                    $joinerQuery->where('wilaya_id', $user->wilaya_id);
                }
                if ($user->role_id === 'baladi') {
                    $joinerQuery->where('commune_id', $user->commune_id);
                }
            })
            ->with(['joiner:id,nom_ar,nom_fr,prenom_ar,prenom_fr,email,etablissement_id,telephone', 'user:id,nom_ar,nom_fr,prenom_ar,prenom_fr']);

            // Search feature
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('description', 'like', "%{$search}%")
                      ->orWhereHas('joiner', function ($joinerQuery) use ($search) {
                          $joinerQuery->where('nom_ar', 'like', "%{$search}%")
                                      ->orWhere('nom_fr', 'like', "%{$search}%")
                                      ->orWhere('prenom_ar', 'like', "%{$search}%")
                                      ->orWhere('prenom_fr', 'like', "%{$search}%")
                                      ->orWhere('email', 'like', "%{$search}%")
                                      ->orWhere('telephone', 'like', "%{$search}%");
                      });
                });
            }

            // Filter by type
            if ($request->filled('type')) {
                $query->where('type', $request->type);
            }

            // Filter by state
            if ($request->filled('state')) {
                $query->where('state', $request->state);
            }

            // Filter by PDF state
            if ($request->filled('pdf_state')) {
                $query->where('pdf_state', $request->pdf_state);
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = min($request->get('per_page', 10), 100);
            $joinerRequests = $query->paginate($perPage);

            // Return result (includes joiner and user info)
            return response()->json([
                'success' => true,
                'data' => JoinerRequestResource::collection($joinerRequests->items()),
                'current_page' => $joinerRequests->currentPage(),
                'per_page' => $joinerRequests->perPage(),
                'total' => $joinerRequests->total(),
                'last_page' => $joinerRequests->lastPage(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching joiner requests: ' . $e->getMessage(),
                'data' => [],
                'current_page' => 1,
                'per_page' => 10,
                'total' => 0,
                'last_page' => 1
            ], 500);
        }
    }
}
