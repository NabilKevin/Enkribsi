<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\AnnouncementResource;

class AnnouncementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $page = max(1, intval($request->input('page', 1)));
        $announcements = Announcement::with('user')->paginate('10', ["*"], 'page', $page);
        AnnouncementResource::collection($announcements);
        return response()->json([
            'status' => 'successful',
            'message' => 'Announcements successfully gotten',
            'data' => $announcements
        ], 200);
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
            ], 422);
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
    public function show($slug)
    {
        $announcement = Announcement::with('user')->firstWhere('slug', $slug);
        if(!$announcement) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Pengumuman tidak ditemukan'
            ], 404);
        }
        return response()->json([
            'status' => 'successful',
            'message' => 'Announcements successfully gotten',
            'data' => new AnnouncementResource($announcement)
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $slug)
    {
        $announcement = Announcement::firstWhere('slug', $slug);
        if(!$announcement) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Announcement not found'
            ], 404);
        }
        $validator = Validator::make($request->all(), [
            'target_audience' => 'integer|exists:divisions,id',
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

        $data['status'] = 'pending';

        $announcement->update($data);

        return response()->json([
            'status' => 'successful',
            'message' => 'Announcement successfully updated'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($slug)
    {
        $announcement = Announcement::firstWhere('slug', $slug);
        if(!$announcement) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Announcement not found'
            ], 404);
        }
        $announcement->delete();
        return response()->json([
            'status' => 'successful',
            'message' => 'Announcement successfully deleted'
        ], 200);
    }
}
