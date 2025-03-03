<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
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
            'data' => Schedule::with('office')->get()
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
            'check_out_time' => 'date_format:H:i:s|required',
            'expired_date' => 'date_format:H:i:s',
            'work_type' => 'required|in:wfa,wfo,wfh',
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
    public function show(Schedule $schedule)
    {
        //
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
            'check_out_time' => 'date_format:H:i:s',
            'expired_date' => 'date_format:H:i:s',
            'work_type' => 'in:wfa,wfo,wfh',
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
            'message' => 'Schedule successfully deleted'
        ], 200);
    }
}
