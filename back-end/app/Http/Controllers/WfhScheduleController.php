<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\WfhScheduleResource;
use App\Models\WfhSchedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WfhScheduleController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'successful',
            'message' => 'Schedules successfully gotten',
            'data' => WfhScheduleResource::collection(WfhSchedule::all())
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => 'date|required',
            'end_date' => 'date|required|after_or_equal:start_date',
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

        $wfhschedule = WfhSchedule::create($data);

        return response()->json([
            'status' => 'successful',
            'message' => 'Schedule successfully created',
            'data' => $wfhschedule
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $wfhschedule = WfhSchedule::find($id);
        if(!$wfhschedule) {
            return response()->json([
                'message' => 'jadwal tidak ditemukan',
                'status' => 'unsuccessful'
            ], 404);
        }
        return response()->json([
            'message' => 'Berhasil mendapatkan jadwal',
            'status' => 'success',
            'data' => $wfhschedule->only(['start_date', 'end_date', 'description'])
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $wfhschedule = WfhSchedule::find($id);
        if(!$wfhschedule) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Schedule not found'
            ], 404);
        }
        $validator = Validator::make($request->all(), [
            'start_date' => 'date',
            'end_date' => 'date|after_or_equal:start_date',
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

        $wfhschedule->update($data);

        return response()->json([
            'status' => 'successful',
            'message' => 'Schedule successfully updated'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $wfhschedule = WfhSchedule::find($id);
        if(!$wfhschedule) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Schedule not found'
            ], 404);
        }
        $wfhschedule->delete();
        return response()->json([
            'status' => 'successful',
            'message' => 'Schedule successfully deleted'
        ], 200);
    }
}
