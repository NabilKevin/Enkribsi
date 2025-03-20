<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\ScheduleResource;
use Illuminate\Support\Facades\Validator;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'status' => 'successful',
            'message' => 'Schedules successfully gotten',
            'data' => ScheduleResource::collection(Schedule::with('office')->get())
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'office_id' => 'required|exists:offices,id',
            'check_in_time' => 'date_format:H:i:s|required',
            'check_out_time' => 'date_format:H:i:s|required|after_or_equal:check_in_time',
            'expired_date' => 'date',
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

        $schedule = Schedule::create($data);

        return response()->json([
            'status' => 'successful',
            'message' => 'Schedule successfully created',
            'data' => $schedule
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $schedule = Schedule::find($id);
        if(!$schedule) {
            return response()->json([
                'message' => 'jadwal tidak ditemukan',
                'status' => 'unsuccessful'
            ], 404);
        }
        return response()->json([
            'message' => 'Berhasil mendapatkan jadwal',
            'status' => 'success',
            'data' => $schedule->only(['office_id', 'check_in_time', 'check_out_time', 'work_type', 'expired_date'])
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $schedule = Schedule::find($id);
        if(!$schedule) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Schedule not found'
            ], 404);
        }
        $validator = Validator::make($request->all(), [
            'office_id' => 'exists:offices,id',
            'check_in_time' => 'date_format:H:i:s',
            'check_out_time' => 'date_format:H:i:s|after_or_equal:check_in_time',
            'expired_date' => 'date',
            'status' => 'prohibited',
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Invalid field',
                'r' => $request->all(),
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();

        $data['status'] = 'pending';

        $schedule->update($data);

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
        $schedule = Schedule::find($id);
        if(!$schedule) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Schedule not found'
            ], 404);
        }
        $schedule->delete();
        return response()->json([
            'status' => 'successful',
            'message' => 'Jadwal berhasil dihapus'
        ], 200);
    }
}
