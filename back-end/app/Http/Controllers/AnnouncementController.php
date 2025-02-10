<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'content' => 'required',
            'target_audience' => 'integer|exists:divisions,id',
            'status' => 'prohibited'
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 200);
        }

        $data = $request->all();

        $announcement = Announcement::create($data);

        return response()->json([
            'status' => 'successful',
            'message' => 'Announcement successfully created',
            'data' => $announcement
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Announcement $announcement)
    {
        $validator = Validator::make($request->all(), [
            'target_audience' => 'integer|exists:divisions,id',
            'status' => 'prohibited'
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ], 200);
        }

        $data = $request->all();

        $announcement->update($data);

        return response()->json([
            'status' => 'successful',
            'message' => 'Announcement successfully updated'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Announcement $announcement)
    {
        $announcement->delete();
        return response()->json([
            'status' => 'successful',
            'message' => 'Announcement successfully deleted'
        ], 200);
    }
}
