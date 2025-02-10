<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Permit;
use App\Models\Division;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

// buat approval announcement
// buat approval jadwal
// buat approval office
// buat approval jadwal wfa/wfh

class BodController extends Controller
{
    public function denyPermit(Request $request, $id)
    {
        $permit = Permit::find($id);

        if(!$permit) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Permit not found'
            ], 404);
        }

        $user = User::find($permit->user_id);
        $myDivision = Division::firstWhere('user_id', $request->user()->id);
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

        if($user->leader_id !== $myDivision->id) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'You are not the leader of this user'
            ], 403);
        }
        if($permit->status === 'approved') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Permit has been approved'
            ], 403);
        }
        if($permit->status === 'denied') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Permit has been denied'
            ], 403);
        }
        if($permit->status === 'canceled') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'User has canceled his permit'
            ], 403);
        }

        $permit->update([
            'status' => 'denied',
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

        if(!$permit) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Permit not found'
            ], 404);
        }

        $user = User::find($permit->user_id);
        $myDivision = Division::firstWhere('user_id', $request->user()->id);
        if($user->leader_id !== $myDivision->id) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'You are not the leader of this user'
            ], 403);
        }
        if($permit->status === 'approved') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Permit has been approved'
            ], 403);
        }
        if($permit->status === 'denied') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Permit has been denied'
            ], 403);
        }
        if($permit->status === 'canceled') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'User has canceled his permit'
            ], 403);
        }

        $permit->update([
            'status' => 'approved'
        ]);

        $absent = Attendance::where('user_id', $permit->user_id)
            ->firstWhere('date', $permit->date);

        if($absent) {
            $absent->update([
                'status' => $permit->permit_type === 'sakit' ? 'izin' : $permit->permit_type,
                'check_out_time' => $permit->permit_type === 'sakit' || $permit->permit_type === 'izin' ? Carbon::now()->toTimeString() : null
            ]);
        } else {
            if(Carbon::parse($permit->date)->isToday()) {
                Attendance::create([
                    'user_id' => $permit->user_id,
                    'date' => Carbon::now()->toDateString(),
                    'status' => $permit->permit_type === 'sakit' ? 'izin' : $permit->permit_type
                ]);
            }
        }

        Notification::create([
            'user_id' => $permit->user_id,
            'title' => 'Perizinan Anda Telah Disetujui!',
            'content' => 'Kami dengan senang hati memberitahukan bahwa permohonan izin Anda telah disetujui. Terima kasih atas kerja sama Anda.'
        ]);

        return response()->json([
            'status' => 'successful',
            'message' => 'Permit successfuly approved',
            'data' => $permit
        ], 200);
    }

    public function getPermits(Request $request)
    {
        $division = Division::firstWhere('user_id', $request->user()->id);
        $permits = Permit::where('leader_id', $division->id)->where('status', 'pending')->get();
        return response()->json([
            'status' => 'successful',
            'message' => 'Successfully get permits',
            'data' => $permits
        ], 200);
    }
}
