<?php

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CommuneController;
use App\Http\Controllers\Api\WilayaController;
use App\Http\Controllers\Api\EtablissementController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\UploadFileController;
use App\Http\Controllers\Api\JoinerRequestController;
use App\Http\Controllers\Api\JoiningTypeController;
use App\Http\Controllers\Api\DocumentTypeController;
use App\Http\Controllers\Api\DocumentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return User::with('etablissement')-> find($request->user()->id);
    });
});

//USER ROUTES
Route::get('/users/count/{etablissement_id}', [UserController::class, 'getCount']);
Route::post('/users/bulk-delete', [UserController::class, 'bulkDelete']);
Route::get('/users/{id}', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::get('/users/{id}/{user}', [UserController::class, 'show']);
Route::put('/users/{user}', [UserController::class, 'update']);
Route::delete('/users/{user}', [UserController::class, 'destroy']);
Route::get('/userview',  [UserController::class, 'index']);
Route::get('/getusers/{id}',  [UserController::class, 'getusers']);
Route::put('/users/{id}/update-nin', [UserController::class, 'updateNin']);
Route::put('updatepassword/{id}', [UserController::class, 'updatePassword']);
Route::post('/upload-file/{id}', [UploadFileController::class, 'uploadFile']);

// USER RESOURCE ROUTES
Route::apiResource('/users', UserController::class);
Route::put('/users/{id}/rfid', [UserController::class, 'updateRfid']);
Route::put('/users/{id}/joining-type', [UserController::class, 'updateJoiningType']);
Route::post('/users/get-by-rfid', [UserController::class, 'getUserByRfid']);

// WILAYA ROUTES
Route::get('/wilayas/count', [WilayaController::class, 'getCount']);
Route::post('/wilayas/bulk-delete', [WilayaController::class, 'bulkDelete']);
Route::get('/wilayas/dropdown', [WilayaController::class, 'getAllForDropdown']);
Route::apiResource('/wilayas', WilayaController::class);
Route::get('/wilayasview',  [WilayaController::class, 'index']);
Route::get('/countlanding',  [WilayaController::class, 'countlanding']);

// COMMUNE ROUTES
Route::get('/communes/count', [CommuneController::class, 'getCount']);
Route::post('/communes/bulk-delete', [CommuneController::class, 'bulkDelete']);
Route::get('/communes/dropdown', [CommuneController::class, 'getAllForDropdown']);
Route::apiResource('/communes', CommuneController::class);
Route::get('/communesview',  [CommuneController::class, 'index']);
Route::get('/communesw/{id}', [CommuneController::class, 'getcommunes']);

// JOINING TYPE ROUTES
Route::get('/joining-types/dropdown', [JoiningTypeController::class, 'getAllForDropdown']);
Route::apiResource('/joining-types', JoiningTypeController::class);

// ETABLISSEMENT ROUTES
Route::get('/etablissements/count', [EtablissementController::class, 'getCount']);
Route::post('/etablissements/bulk-delete', [EtablissementController::class, 'bulkDelete']);
Route::post('/etablissements/{id}/upload-logo', [EtablissementController::class, 'uploadLogo']);
Route::delete('/etablissements/{id}/delete-logo', [EtablissementController::class, 'deleteLogo']);
Route::put('/etablissements/{id}/parameters', [EtablissementController::class, 'updateParameters']);
Route::apiResource('/etablissements', EtablissementController::class);

// JOINER ROUTES (formerly Parent routes)
Route::post('/joiners/register', [UserController::class, 'registerJoiner']);
Route::put('/joiners/{id}/state', [UserController::class, 'updateJoinerState']);

// AUTH ROUTES
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login/{id}', [AuthController::class, 'login']);

// Dashboard Routes
Route::middleware('auth:sanctum')->get('/dashboard/stats', [DashboardController::class, 'getDashboardStats']);

Route::middleware('auth:sanctum')->group(function () {
    // JOINER ROUTES (admin/manager views)
    Route::get('/joiners/count', [UserController::class, 'getJoinersCount']);
    Route::get('/joiners', [UserController::class, 'getJoiners']);

    // PAYMENT ROUTES
    Route::get('/payments/statistics', [PaymentController::class, 'getStatistics']);
    Route::get('/payments', [PaymentController::class, 'index']);

    // GDE ROUTES
  
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::get('/payments/{payment}', [PaymentController::class, 'show']);
    Route::put('/payments/{payment}', [PaymentController::class, 'update']);
    Route::delete('/payments/{payment}', [PaymentController::class, 'destroy']);
    Route::put('/payments/{payment}/state', [PaymentController::class, 'paymentState']);
    Route::post('/payments/{payment}/upload-pdf', [PaymentController::class, 'uploadPdf']);
    Route::get('/payments/{payment}/iscard', [PaymentController::class, 'isCard']);
    Route::get('/payments/establishment/{etablissement_id}', [PaymentController::class, 'getByEstablishment']);

    // JOINER PAYMENT ROUTES (joiner creates payment for themselves)
    Route::post('/joiner/payments', [PaymentController::class, 'createForCurrentJoiner']);

    // Joiner receipt upload
    Route::post('/joiner/{userId}/upload-receipt', [UserController::class, 'uploadReceipt']);

    // Payment state management (national manager only)
    Route::put('/users/{userId}/payment-state', [UserController::class, 'updatePaymentState']);

    // JOINER REQUEST ROUTES
    Route::get('/joiner-requests/establishment/{etablissement_id}', [JoinerRequestController::class, 'getByEstablishment']);
    Route::post('/joiner-requests/{joiner_request}/upload-pdf', [JoinerRequestController::class, 'uploadPdf']);
    Route::put('/joiner-requests/{joiner_request}/pdf-state', [JoinerRequestController::class, 'updatePdfState']);
    Route::apiResource('/joiner-requests', JoinerRequestController::class);
});


  Route::apiResource('/document-types', DocumentTypeController::class);
    Route::apiResource('/documents', DocumentController::class);

// Image proxy route to handle CORS for html2canvas (logos, identity images, self photos)
Route::get('/logo-proxy', function (Request $request) {
    if (!$request->has('path')) {
        return response()->json(['error' => 'Path is required'], 400);
    }
    
    $path = $request->query('path');
    
    // Allowed path prefixes and their resolution
    $publicPrefixes = ['uploads/logos/'];
    $storagePrefixes = ['identity_images/', 'self_photos/'];
    
    $fullPath = null;
    
    foreach ($publicPrefixes as $prefix) {
        if (str_starts_with($path, $prefix)) {
            $fullPath = public_path($path);
            break;
        }
    }
    
    if (!$fullPath) {
        foreach ($storagePrefixes as $prefix) {
            if (str_starts_with($path, $prefix)) {
                $fullPath = storage_path('app/public/' . $path);
                break;
            }
        }
    }
    
    if (!$fullPath) {
        return response()->json(['error' => 'Invalid path'], 403);
    }
    
    if (!file_exists($fullPath)) {
        return response()->json(['error' => 'File not found'], 404);
    }
    
    $file = file_get_contents($fullPath);
    $type = mime_content_type($fullPath);
    
    return response($file)->header('Content-Type', $type);
});
