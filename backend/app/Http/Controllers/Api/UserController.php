<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of users with pagination and filtering.
     */
    public function index($user_id, Request $request)
    {
        $query = User::with(['etablissement', 'wilaya', 'commune']);
        $user = User::find($user_id);
        
        // Get the current authenticated user's role
        $currentUserRole = $user->role_id;
        
        // Apply role-based filtering for association
        switch ($currentUserRole) {
            case 'admin':
                // Admin can see national managers
                $query->whereIn('role_id', ['national']);
                break;
                
            case 'national':
                // National manager can see wilaya managers and printers
                $query->whereIn('role_id', ['wilaya', 'printer']);
                break;

            case 'wilaya':
                // Wilaya manager can see baladi managers with same wilaya
                $query->where('wilaya_id', $user->wilaya_id)
                      ->whereIn('role_id', ['baladi']);
                break;

            case 'baladi':
                // Baladi manager can see joiners with same wilaya and commune
                $query->where('wilaya_id', $user->wilaya_id)
                      ->where('commune_id', $user->commune_id)
                      ->whereIn('role_id', ['joiner']);
                break;
                
            case 'joiner':
                // Joiners can only see themselves
                $query->where('id', $user->id);
                break;
                
            default:
                $query->where('id', $user->id);
                break;
        }

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nom_ar', 'like', "%{$search}%")
                  ->orWhere('nom_fr', 'like', "%{$search}%")
                  ->orWhere('prenom_ar', 'like', "%{$search}%")
                  ->orWhere('prenom_fr', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        if ($request->has('role_id') && !empty($request->role_id)) {
            $query->where('role_id', $request->role_id);
        }
        if ($request->has('etablissement_id') && !empty($request->etablissement_id)) {
            $query->where('etablissement_id', $request->etablissement_id);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'id');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = min($request->get('per_page', 10), 100);
        $users = $query->paginate($perPage);

        return UserResource::collection($users);
    }

    /**
     * Store a newly created user.
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $currentUser = $request->user();

        // Automatically assign wilaya_id if not provided and current user is a wilaya manager
        if (!isset($data['wilaya_id']) && $currentUser && $currentUser->role_id === 'wilaya') {
            $data['wilaya_id'] = $currentUser->wilaya_id;
        }

        // Handle establishment inheritance if not provided
        if (!isset($data['etablissement_id']) && $currentUser && in_array($currentUser->role_id, ['wilaya', 'baladi', 'national'])) {
             $data['etablissement_id'] = $currentUser->etablissement_id;
        }
        
        // Hash password if provided
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        // Handle self photo upload
        if ($request->hasFile('self_photo')) {
            $selfPhoto = $request->file('self_photo');
            $selfPhotoName = time() . '_self_' . $selfPhoto->getClientOriginalName();
            $selfPhotoPath = $selfPhoto->storeAs('public/self_photos', $selfPhotoName);
            $data['self_photo'] = 'self_photos/' . $selfPhotoName;
        }

        $user = User::create($data);

        return response()->json([
            'message' => 'User created successfully',
            'user' => new UserResource($user),
        ], 201);
    }

    /**
     * Display the specified user.
     */
    public function show($id)
    {
        $user = User::with(['etablissement'])->findOrFail($id);
        return new UserResource($user);
    }

    /**
     * Update the specified user.
     */
    public function update(UpdateUserRequest $request, $id)
    {
        try {
            $user = User::findOrFail($id);
            $data = $request->validated();

            // Hash password if provided
            if (isset($data['password']) && !empty($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }

            // Handle self photo upload
            if ($request->hasFile('self_photo')) {
                if ($user->self_photo) {
                    $oldPhotoPath = 'public/' . $user->self_photo;
                    if (Storage::exists($oldPhotoPath)) {
                        Storage::delete($oldPhotoPath);
                    }
                }
                
                $selfPhoto = $request->file('self_photo');
                $selfPhotoName = time() . '_self_' . $selfPhoto->getClientOriginalName();
                $selfPhotoPath = $selfPhoto->storeAs('public/self_photos', $selfPhotoName);
                $data['self_photo'] = 'self_photos/' . $selfPhotoName;
            }

            $updated = $user->update($data);
            
            if (!$updated) {
                return response()->json([
                    'message' => 'Failed to update user',
                    'error' => 'Update operation returned false'
                ], 500);
            }

            $user->refresh();

            return response()->json([
                'message' => 'User updated successfully',
                'user' => new UserResource($user),
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'User not found',
                'error' => $e->getMessage()
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified user.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ], 200);
    }

    /**
     * Update user RFID only.
     */
    public function updateRfid(Request $request, $id)
    {
        $request->validate([
            'rfid' => 'nullable|string|max:255|unique:users,rfid,' . $id,
        ]);

        try {
            $user = User::findOrFail($id);
            $user->update([
                'rfid' => $request->rfid
            ]);

            return response()->json([
                'message' => 'RFID updated successfully',
                'user' => new UserResource($user),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update RFID',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user by RFID.
     */
    public function getUserByRfid(Request $request)
    {
        $request->validate([
            'rfid' => 'required|string|max:255',
        ]);

        try {
            $user = User::where('rfid', $request->rfid)
                        ->with(['etablissement'])
                        ->first();

            if (!$user) {
                return response()->json([
                    'message' => 'RFID card not found in system',
                ], 404);
            }

            return response()->json([
                'message' => 'User found successfully',
                'user' => new UserResource($user),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to find user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk delete users.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:users,id',
        ]);

        $deletedCount = User::whereIn('id', $request->ids)->delete();

        return response()->json([
            'message' => "{$deletedCount} users deleted successfully",
        ], 200);
    }

    /**
     * Get users count for statistics.
     */
    public function getCount($etablissement_id, Request $request)
    {
        $query = User::query();
        $query->where('etablissement_id', $etablissement_id);

        $total = $query->count();

        $roleQuery = clone $query;
        $roleCounts = $roleQuery->selectRaw('role_id, count(*) as count')
            ->groupBy('role_id')
            ->pluck('count', 'role_id')
            ->toArray();

        $availableRoles = [
            'admin',
            'national',
            'wilaya',
            'baladi',
            'joiner',
            'printer'
        ];

        $counts = ['all' => $total];
        foreach ($availableRoles as $roleName) {
            $counts[$roleName] = $roleCounts[$roleName] ?? 0;
        }

        return response()->json($counts, 200);
    }

    /**
     * Register a new joiner (public registration).
     */
    public function registerJoiner(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nom_ar' => 'required|string|max:255',
                'nom_fr' => 'required|string|max:255',
                'prenom_ar' => 'required|string|max:255',
                'prenom_fr' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6|confirmed',
                'telephone' => 'required|string|max:20',
                'date_nais' => 'required|date',
                'sex' => 'required|integer|in:0,1',
                'nb_crt' => 'required|string|max:10',
                'nin' => 'required|string|size:18|unique:users,nin',
                'adress' => 'required|string',
                'wilaya_id' => 'required|exists:wilayas,id',
                'commune_id' => 'required|exists:communes,id',
                'wilaya_res_id' => 'required|exists:wilayas,id',
                'commune_res_id' => 'required|exists:communes,id',
                'etablissement_id' => 'required|exists:etablissements,id',
                'profession' => 'required|string|max:255',
                'identity_image' => 'nullable|image|max:5120',
                'self_photo' => 'nullable|image|max:5120',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            $data['role_id'] = 'joiner';
            $data['app_id'] = 1;
            $data['password'] = Hash::make($data['password']);

            // Get the joining type with enrollment_code = 0
            $joiningType = \App\Models\JoiningType::where('enrollment_code', 0)->first();
            if ($joiningType) {
                $data['joining_type_id'] = $joiningType->id;
            }

            // Check if etablissement requires validation
            $etablissement = \App\Models\Etablissement::find($data['etablissement_id']);
            $isValidationRequired = $etablissement ? $etablissement->is_validation : true;
            
            // If validation is required, state is 0 (pending), otherwise 1 (active)
            $data['state'] = $isValidationRequired ? 0 : 1;

            if ($data['state'] === 1 && $joiningType) {
                $data['joining_date'] = now();
                $data['expiration_date'] = now()->addYears($joiningType->card_validity);
            }

            // Handle identity image upload
            if ($request->hasFile('identity_image')) {
                $identityImage = $request->file('identity_image');
                $identityImageName = time() . '_id_' . $identityImage->getClientOriginalName();
                $identityImage->storeAs('public/identity_images', $identityImageName);
                $data['identity_image'] = 'identity_images/' . $identityImageName;
            }

            // Handle self photo upload
            if ($request->hasFile('self_photo')) {
                $selfPhoto = $request->file('self_photo');
                $selfPhotoName = time() . '_self_' . $selfPhoto->getClientOriginalName();
                $selfPhoto->storeAs('public/self_photos', $selfPhotoName);
                $data['self_photo'] = 'self_photos/' . $selfPhotoName;
            }

            $user = User::create($data);
            $token = $user->createToken('main')->plainTextToken;

            return response()->json([
                'message' => 'Joiner registered successfully',
                'user' => $user,
                'token' => $token
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update joiner state (activate/deactivate).
     */
    public function updateJoinerState(Request $request, $id)
    {
        try {
            $request->validate([
                'state' => 'required|integer|in:0,1',
            ]);

            $joiner = User::where('role_id', 'joiner')->findOrFail($id);
            $joiner->state = $request->state;

            if ($request->state == 1) {
                if (!$joiner->joining_date) {
                    $joiner->joining_date = now();
                    $joiningType = $joiner->joiningType ?? \App\Models\JoiningType::where('enrollment_code', 0)->first();
                    if ($joiningType) {
                        $joiner->expiration_date = now()->addYears($joiningType->card_validity);
                    }
                }
            }

            $joiner->save();

            return response()->json([
                'message' => 'Joiner state updated successfully',
                'user' => new UserResource($joiner)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update joiner state',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all joiners with visibility filtering.
     * - national: sees all joiners
     * - wilaya: sees joiners with same wilaya_id
     * - baladi: sees joiners with same wilaya_id AND commune_id
     */
    public function getJoiners(Request $request)
    {
        try {
            $currentUser = $request->user();
            
            $query = User::with(['etablissement'])
                ->where('role_id', 'joiner');

            // national, printer and admin see all
            if ($currentUser->role_id === 'baladi') {
                $query->where('wilaya_id', $currentUser->wilaya_id)
                      ->where('commune_id', $currentUser->commune_id);
            } elseif ($currentUser->role_id === 'wilaya') {
                $query->where('wilaya_id', $currentUser->wilaya_id);
            } elseif (in_array($currentUser->role_id, ['national', 'printer', 'admin'])) {
                // Sees all
            } else {
                // Default to none or own if role not recognized
                $query->where('id', $currentUser->id);
            }

            // Search functionality
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('nom_ar', 'like', "%{$search}%")
                      ->orWhere('nom_fr', 'like', "%{$search}%")
                      ->orWhere('prenom_ar', 'like', "%{$search}%")
                      ->orWhere('prenom_fr', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 10);
            $joiners = $query->paginate($perPage);

            return response()->json([
                'data' => $joiners->items(),
                'current_page' => $joiners->currentPage(),
                'per_page' => $joiners->perPage(),
                'total' => $joiners->total(),
                'last_page' => $joiners->lastPage(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching joiners',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get total count of joiners with visibility filtering.
     */
    public function getJoinersCount(Request $request)
    {
        try {
            $currentUser = $request->user();
            
            $query = User::where('role_id', 'joiner');

            if ($currentUser->role_id === 'baladi') {
                $query->where('wilaya_id', $currentUser->wilaya_id)
                      ->where('commune_id', $currentUser->commune_id);
            } elseif ($currentUser->role_id === 'wilaya') {
                $query->where('wilaya_id', $currentUser->wilaya_id);
            } elseif (in_array($currentUser->role_id, ['national', 'printer', 'admin'])) {
                // Sees all
            }

            $joinersCount = $query->count();
            
            return response()->json([
                'data' => $joinersCount,
                'message' => 'Joiners count retrieved successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching joiners count',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload payment receipt for joiner
     */
    public function uploadReceipt(Request $request, $userId)
    {
        $validator = Validator::make($request->all(), [
            'pdf' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        
        if ($user->id != $userId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        if ($user->role_id !== 'joiner') {
            return response()->json([
                'success' => false,
                'message' => 'Only joiners can upload payment receipts'
            ], 403);
        }

        if ($user->state != 1) {
            return response()->json([
                'success' => false,
                'message' => 'You are not eligible to upload a receipt at this time'
            ], 400);
        }

        // Delete old receipt if exists
        if ($user->price_receipt && Storage::exists($user->price_receipt)) {
            Storage::delete($user->price_receipt);
        }

        // Store new receipt
        $path = $request->file('pdf')->store('receipts', 'public');
        
        $user->update([
            'price_receipt' => $path
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم رفع الملف بنجاح',
            'receipt_path' => $path,
            'data' => [
                'id' => $user->id,
                'price_receipt' => $path
            ]
        ]);
    }

    /**
     * Update joiner payment state (national manager only)
     */
    public function updatePaymentState(Request $request, $userId)
    {
        try {
            $request->validate([
                'state' => 'required|integer|in:0,1,2',
            ]);

            $currentUser = $request->user();
            
            // Only national managers and admins can update payment state
            if (!in_array($currentUser->role_id, ['admin', 'national'])) {
                return response()->json([
                    'message' => 'Unauthorized'
                ], 403);
            }

            $joiner = User::findOrFail($userId);

            $joiner->state = $request->state;
            $joiner->save();

            return response()->json([
                'message' => 'Payment state updated successfully',
                'user' => new UserResource($joiner)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update payment state',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update NIN for a user.
     */
    public function updateNin(Request $request, $id)
    {
        $request->validate([
            'nin' => 'required|string|size:18',
        ]);

        try {
            $user = User::findOrFail($id);
            $user->update(['nin' => $request->nin]);

            return response()->json([
                'message' => 'NIN updated successfully',
                'user' => new UserResource($user),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update NIN',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update password for a user.
     */
    public function updatePassword(Request $request, $id)
    {
        $request->validate([
            'password' => 'required|string|min:6|confirmed',
        ]);

        try {
            $user = User::findOrFail($id);
            $user->update(['password' => Hash::make($request->password)]);

            return response()->json([
                'message' => 'Password updated successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update password',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update joining type and expiration date for a joiner.
     */
    public function updateJoiningType(Request $request, $id)
    {
        $request->validate([
            'joining_type_id' => 'required|exists:joining_types,id',
        ]);

        try {
            $user = User::findOrFail($id);
            $joiningType = \App\Models\JoiningType::findOrFail($request->joining_type_id);

            // Use existing joining_date or current time if not set
            $joiningDate = $user->joining_date ? \Carbon\Carbon::parse($user->joining_date) : now();
            
            // Calculate new expiration date based on joining_type card_validity (years)
            $expirationDate = $joiningDate->copy()->addYears($joiningType->card_validity);

            $user->update([
                'joining_type_id' => $request->joining_type_id,
                'joining_date' => $joiningDate,
                'expiration_date' => $expirationDate,
            ]);

            return response()->json([
                'message' => 'Joining type and expiration date updated successfully',
                'user' => new UserResource($user),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update joining type',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
