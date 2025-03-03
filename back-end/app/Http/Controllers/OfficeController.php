<?php

namespace App\Http\Controllers;

use App\Models\Office;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
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
            'data' => Office::all()
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
            'status' => 'prohibited',
            'work_type' => 'required|in:wfa,wfo,wfh'
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
    public function show(Office $office)
    {
        //
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
            'status' => 'prohibited',
            'work_type' => 'in:wfa,wfo,wfh'
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
