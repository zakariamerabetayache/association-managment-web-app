<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JoiningType;
use App\Http\Requests\StoreJoiningTypeRequest;
use App\Http\Requests\UpdateJoiningTypeRequest;
use Illuminate\Http\Request;

class JoiningTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = JoiningType::query();
        
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('designation_ar', 'like', "%{$search}%")
                  ->orWhere('designation_fr', 'like', "%{$search}%");
        }
        
        return response()->json($query->paginate($request->get('per_page', 10)));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJoiningTypeRequest $request)
    {
        $joiningType = JoiningType::create($request->validated());
        return response()->json($joiningType, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(JoiningType $joiningType)
    {
        return response()->json($joiningType);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateJoiningTypeRequest $request, JoiningType $joiningType)
    {
        $joiningType->update($request->validated());
        return response()->json($joiningType);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JoiningType $joiningType)
    {
        $joiningType->delete();
        return response()->json(null, 204);
    }

    /**
     * Get all joining types for dropdown.
     */
    public function getAllForDropdown()
    {
        return response()->json(
            JoiningType::select('id as value', 'designation_ar as label')->get()
        );
    }
}
