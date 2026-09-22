<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    /**
     * Helper: Get joiner IDs visible to the authenticated user based on role.
     * - national: sees all joiners
     * - wilaya: sees joiners with same wilaya_id
     * - baladi: sees joiners with same wilaya_id AND commune_id
     * - joiner: sees only own payments
     */
    private function getVisibleJoinerIds(User $user)
    {
        if ($user->role_id === 'joiner') {
            return collect([$user->id]);
        }

        $query = User::where('role_id', 'joiner');

        if ($user->role_id === 'baladi') {
            $query->where('wilaya_id', $user->wilaya_id)
                  ->where('commune_id', $user->commune_id);
        } elseif ($user->role_id === 'wilaya') {
            $query->where('wilaya_id', $user->wilaya_id);
        }
        // national and admin see all joiners (no filter)

        return $query->pluck('id');
    }

    /**
     * Display a listing of payments.
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            $query = Payment::with(['user:id,nom_ar,nom_fr,prenom_ar,prenom_fr,email']);

            // Role-based filtering using visibility helper
            $visibleIds = $this->getVisibleJoinerIds($user);
            if ($user->role_id !== 'admin') {
                $query->whereIn('user_id', $visibleIds);
            }

            // Search functionality
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->whereHas('user', function($userQuery) use ($search) {
                        $userQuery->where('nom_ar', 'like', "%{$search}%")
                                 ->orWhere('nom_fr', 'like', "%{$search}%")
                                 ->orWhere('prenom_ar', 'like', "%{$search}%")
                                 ->orWhere('prenom_fr', 'like', "%{$search}%")
                                 ->orWhere('email', 'like', "%{$search}%");
                    })->orWhere('amount', 'like', "%{$search}%");
                });
            }

            // Filter by state
            if ($request->has('state') && $request->state !== '') {
                $query->where('state', $request->state);
            }

            // Filter by user_id (joiner)
            if ($request->has('user_id') && !empty($request->user_id)) {
                $query->where('user_id', $request->user_id);
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 10);
            $payments = $query->paginate($perPage);

            return response()->json($payments);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching payments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created payment.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|exists:users,id',
                'amount' => 'required|numeric|min:0',
                'date' => 'required|date',
                'pdf' => 'nullable|file|mimes:pdf|max:10240',
                'state' => 'integer|in:0,1',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Handle PDF upload if provided
            $pdfPath = null;
            $state = $request->state ?? 0;
            
            if ($request->hasFile('pdf')) {
                $pdfPath = $request->file('pdf')->store('payments', 'public');
                $state = 1;
            }

            $payment = Payment::create([
                'user_id' => $request->user_id,
                'amount' => $request->amount,
                'date' => $request->date,
                'pdf_path' => $pdfPath,
                'state' => $state,
            ]);
            
            $payment->load(['user:id,nom_ar,nom_fr,prenom_ar,prenom_fr,email']);

            return response()->json([
                'message' => 'Payment created successfully',
                'data' => $payment
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified payment.
     */
    public function show(Request $request, Payment $payment)
    {
        try {
            $user = $request->user();

            // Check permissions
            if ($user->role_id === 'joiner' && $payment->user_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            if (in_array($user->role_id, ['national', 'wilaya', 'baladi'])) {
                $visibleIds = $this->getVisibleJoinerIds($user);
                if (!$visibleIds->contains($payment->user_id)) {
                    return response()->json(['message' => 'Unauthorized'], 403);
                }
            }

            $payment->load(['user:id,nom_ar,nom_fr,prenom_ar,prenom_fr,email']);

            return response()->json([
                'data' => $payment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified payment.
     */
    public function update(Request $request, Payment $payment)
    {
        try {
            $user = $request->user();

            // Check permissions - only admin and national manager can update payments
            if (!in_array($user->role_id, ['admin', 'national'])) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $validator = Validator::make($request->all(), [
                'user_id' => 'sometimes|exists:users,id',
                'amount' => 'sometimes|numeric|min:0',
                'date' => 'sometimes|date',
                'pdf_path' => 'nullable|string',
                'state' => 'sometimes|integer|in:0,1',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $payment->update($request->all());
            $payment->load(['user:id,nom_ar,nom_fr,prenom_ar,prenom_fr,email']);

            return response()->json([
                'message' => 'Payment updated successfully',
                'data' => $payment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified payment.
     */
    public function destroy(Request $request, Payment $payment)
    {
        try {
            $user = $request->user();

            // Check permissions - only admin and national manager can delete payments
            if (!in_array($user->role_id, ['admin', 'national'])) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Delete PDF file if exists
            if ($payment->pdf_path && Storage::exists($payment->pdf_path)) {
                Storage::delete($payment->pdf_path);
            }

            $payment->delete();

            return response()->json([
                'message' => 'Payment deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if the joiner should see the payment card (no payments exist yet).
     */
    public function isCard($userId)
    {
        if (!$userId) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }
    
        $hasPayments = Payment::where("user_id", $userId)->exists();
        $iscard = $hasPayments ? false : true;
    
        return response()->json([
            "data" => $iscard
        ]);
    }

    public function paymentState($id, Request $request)
    {
        $validated = $request->validate([
            'state' => 'required|integer|in:0,1',
        ]);
    
        $payment = Payment::find($id);
    
        if (!$payment) {
            return response()->json([
                'message' => 'Payment not found',
            ], 404);
        }
    
        $payment->update([
            'state' => $validated['state'],
        ]);
    
        return response()->json([
            'message' => 'Payment state updated successfully',
            'payment' => $payment,
        ], 200);
    }

    /**
     * Upload PDF receipt for a payment.
     */
    public function uploadPdf(Request $request, Payment $payment)
    {
        try {
            $user = $request->user();

            // Check permissions - joiners can upload for their own payments
            if ($user->role_id === 'joiner' && $payment->user_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            if (in_array($user->role_id, ['national', 'wilaya', 'baladi'])) {
                $visibleIds = $this->getVisibleJoinerIds($user);
                if (!$visibleIds->contains($payment->user_id)) {
                    return response()->json(['message' => 'Unauthorized'], 403);
                }
            }

            $validator = Validator::make($request->all(), [
                'pdf' => 'required|file|mimes:pdf|max:10240',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Delete old PDF if exists
            if ($payment->pdf_path && Storage::exists($payment->pdf_path)) {
                Storage::delete($payment->pdf_path);
            }

            // Store new PDF
            $path = $request->file('pdf')->store('payments', 'public');
            
            $payment->update([
                'pdf_path' => $path,
                'state' => 1
            ]);

            return response()->json([
                'message' => 'PDF uploaded successfully',
                'data' => $payment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error uploading PDF',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payments for a specific establishment (admin/manager only).
     */
    public function getByEstablishment(Request $request, $etablissementId)
    {
        try {
            $user = $request->user();

            // Check permissions
            if (!in_array($user->role_id, ['admin', 'national', 'wilaya', 'baladi'])) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Get joiner IDs for this establishment with visibility filtering
            $query = User::where('etablissement_id', $etablissementId)
                ->where('role_id', 'joiner');
            
            // Apply visibility filtering
            if ($user->role_id === 'baladi') {
                $query->where('wilaya_id', $user->wilaya_id)
                      ->where('commune_id', $user->commune_id);
            } elseif ($user->role_id === 'wilaya') {
                $query->where('wilaya_id', $user->wilaya_id);
            }

            $joinerIds = $query->pluck('id');

            if ($joinerIds->isEmpty()) {
                return response()->json([
                    'data' => [],
                    'current_page' => 1,
                    'per_page' => 10,
                    'total' => 0,
                    'last_page' => 1
                ]);
            }

            $paymentsQuery = Payment::with(['user:id,nom_ar,nom_fr,prenom_ar,prenom_fr,email,etablissement_id'])
                ->whereIn('user_id', $joinerIds);

            // Search functionality
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $paymentsQuery->where(function($q) use ($search) {
                    $q->whereHas('user', function($userQuery) use ($search) {
                        $userQuery->where('nom_ar', 'like', "%{$search}%")
                                 ->orWhere('nom_fr', 'like', "%{$search}%")
                                 ->orWhere('prenom_ar', 'like', "%{$search}%")
                                 ->orWhere('prenom_fr', 'like', "%{$search}%")
                                 ->orWhere('email', 'like', "%{$search}%");
                    })->orWhere('amount', 'like', "%{$search}%");
                });
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $paymentsQuery->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 10);
            $payments = $paymentsQuery->paginate($perPage);

            return response()->json($payments);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching payments for establishment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a payment for the current authenticated joiner.
     * Only requires PDF upload - amount comes from etablissement.price, date is current date
     */
    public function createForCurrentJoiner(Request $request)
    {
        try {
            $user = $request->user();
            $user->load('etablissement');

            // Ensure only joiners can create payments
            if ($user->role_id !== 'joiner') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $validator = Validator::make($request->all(), [
                'pdf' => 'required|file|mimes:pdf|max:10240',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if user has etablissement
            if (!$user->etablissement) {
                return response()->json([
                    'message' => 'User etablissement not found',
                    'error' => 'Please contact administrator to set up your establishment'
                ], 400);
            }
            
            // Get amount from user's etablissement price
            $amount = $user->etablissement->price ?? 0;
            
            // Handle PDF upload (required)
            $pdfPath = $request->file('pdf')->store('payments', 'public');

            // Create payment record
            $payment = Payment::create([
                'user_id' => $user->id, 
                'amount' => $amount, 
                'date' => now()->format('Y-m-d'), 
                'pdf_path' => $pdfPath,
                'state' => 0,
            ]);
            
            $payment->load(['user:id,nom_ar,nom_fr,prenom_ar,prenom_fr,email']);

            return response()->json([
                'message' => 'Payment created successfully',
                'data' => $payment
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Payment creation error: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Error creating payment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get payment statistics for the current user
     */
    public function getStatistics(Request $request)
    {
        try {
            $user = $request->user();
            
            $query = Payment::query();
            
            if ($user->role_id === 'joiner') {
                $query->where('user_id', $user->id);
            } elseif (in_array($user->role_id, ['national', 'wilaya', 'baladi'])) {
                $visibleIds = $this->getVisibleJoinerIds($user);
                $query->whereIn('user_id', $visibleIds);
            }
            // admin sees all
            
            $totalPayments = $query->count();
            $pendingPayments = (clone $query)->where('state', 0)->count();
            $completedPayments = (clone $query)->where('state', 1)->count();
            $totalAmount = (clone $query)->sum('amount');
            
            return response()->json([
                'total' => $totalPayments,
                'pending' => $pendingPayments,
                'completed' => $completedPayments,
                'total_amount' => $totalAmount
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching payment statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
