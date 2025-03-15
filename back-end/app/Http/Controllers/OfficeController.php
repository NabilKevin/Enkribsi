<?php

namespace App\Http\Controllers;

use App\Models\Office;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\OfficeResource;
use Illuminate\Support\Facades\Validator;

class OfficeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'status' => 'successful',
            'message' => 'Offices successfully gotten',
            'data' => OfficeResource::collection(Office::all())
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:offices,name',
            'latitude' => 'numeric|required',
            'longitude' => 'numeric|required',
            'radius' => 'required',
            'work_type' => 'required|in:wfh,wfa,wfo',
            'status' => 'prohibited'
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();

        $office = Office::create($data);

        return response()->json([
            'status' => 'successful',
            'message' => 'Office successfully created',
            'data' => $office
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $office = Office::find($id);
        if(!$office) {
            return response()->json([
                'message' => 'Kantor tidak ditemukan',
                'status' => 'unsuccessful'
            ], 404);
        }
        return response()->json([
            'message' => 'Berhasil mendapatkan kantor',
            'status' => 'success',
            'data' => $office->only(['name', 'work_type', 'latitude', 'longitude', 'radius'])
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $office = Office::find($id);
        if(!$office) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Office not found'
            ], 404);
        }
        $rule = [
            'latitude' => 'numeric',
            'longitude' => 'numeric',
            'work_type' => 'in:wfh,wfa,wfo',
            'status' => 'prohibited'
        ];

        if(isset($request->name) && $office->name !== $request->name) {
            $rule['name'] = 'unique:offices,name';
        }
        $validator = Validator::make($request->all(), $rule);

        if($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();

        $data['status'] = 'pending';

        $office->update($data);

        return response()->json([
            'status' => 'successful',
            'message' => 'Office successfully updated'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $office = Office::find($id);
        if(!$office) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Office not found'
            ], 404);
        }
        $office->delete();

        return response()->json([
            'status' => 'successful',
            'message' => 'Office successfully deleted'
        ], 200);
    }
}
