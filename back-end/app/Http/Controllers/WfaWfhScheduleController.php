<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WfaWfhSchedule;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class WfaWfhScheduleController extends Controller
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
            'office_id' => 'exists:offices,id',
            'user_id' => 'exists:users,id',
            'start_date' => 'date_format:H:i:s|required',
            'end_date' => 'date_format:H:i:s|required',
            'type' => 'required|in:wfa,wfh',
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

        $wfaWfhSchedule = WfaWfhSchedule::create($data);

        return response()->json([
            'status' => 'successful',
            'message' => 'Wfa/Wfh Schedule successfully created',
            'data' => $wfaWfhSchedule
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(WfaWfhSchedule $wfaWfhSchedule)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, WfaWfhSchedule $wfaWfhSchedule)
    {
        $validator = Validator::make($request->all(), [
            'office_id' => 'exists:offices,id',
            'user_id' => 'exists:users,id',
            'start_date' => 'date_format:H:i:s',
            'end_date' => 'date_format:H:i:s',
            'type' => 'in:wfa,wfh',
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

        $wfaWfhSchedule->update($data);

        return response()->json([
            'status' => 'successful',
            'message' => 'WfaWfhSchedule successfully updated'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WfaWfhSchedule $wfaWfhSchedule)
    {
        $wfaWfhSchedule->delete();
        return response()->json([
            'status' => 'successful',
            'message' => 'WfaWfhSchedule successfully deleted'
        ], 200);
    }
}
