<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Permit;
use App\Models\Division;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

class BodController extends Controller
{
    public function denyPermit(Request $request, $id)
    {
        $permit = Permit::find($id);

        $user = User::find($permit->user_id);
        $me = Division::find($request->user()->id);
        if($user->leader_id !== $me->id) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'You are not the leader of this user'
            ], 403);
        }
        if($permit->is_approved) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Permit has been approved'
            ], 403);
        }
        if($permit->is_approved === false) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Permit has been denied'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'bod_reason' => 'required|string'
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Invalid fields',
                'errors' => $validator->errors()
            ], 422);
        }

        $permit->update([
            'is_approved' => false,
            'bod_reason' => $request->bod_reason
        ]);
        return response()->json([
            'status' => 'successful',
            'message' => 'Permit successfuly denied',
            'data' => $permit
        ], 200);
    }
    public function approvePermit(Request $request, $id)
    {
        $permit = Permit::find($id);

        $user = User::find($permit->user_id);
        $me = Division::find($request->user()->id);
        if($user->leader_id !== $me->id) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'You are not the leader of this user'
            ], 403);
        }
        if($permit->is_approved) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Permit has been approved'
            ], 403);
        }
        if($permit->is_approved === false) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Permit has been denied'
            ], 403);
        }
        $permit->update([
            'is_approved' => true
        ]);

        $absent = Attendance::where('user_id', $permit->user_id)
            ->firstWhere('date', $permit->date);

        if($absent) {
            $absent->update([
                'status' => 'pulang',
                'work_end_time' => Carbon::now()->toTimeString()
            ]);
        }

        return response()->json([
            'status' => 'successful',
            'message' => 'Permit successfuly approved',
            'data' => $permit
        ], 200);
    }
}
