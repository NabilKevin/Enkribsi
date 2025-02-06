<?php

namespace App\Http\Controllers;

use App\Models\Permit;
use Carbon\Carbon;
use App\Models\Office;
use App\Models\Attendance;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Division;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AbsenController extends Controller
{
    public function checkLocation(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'lat' => 'required|numeric',
            'lon' => 'required|numeric',
            'office' => 'required|int'
        ]);
        if($validator->fails()) {
            return response()->json([
                'message' => 'Invalid fields',
                'errors' => $validator->errors()
            ], 422);
        }

        $office = Office::find($request->office);

        $earthRadius = 6371000;

        // Konversi derajat ke radian
        $latFrom = deg2rad($office->latitude);
        $lonFrom = deg2rad($office->longitude);
        $latTo = deg2rad($request->lat);
        $lonTo = deg2rad($request->lon);

        // Hitung perbedaan latitude dan longitude
        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        // Hitung jarak menggunakan rumus Haversine
        $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
            cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));

        if(($angle * $earthRadius) <= $office->radius) {
            return response()->json([
                'status' => 'successful',
                'message' => 'You are in the office area'
            ], 200);
        } else {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'You are not in the office area'
            ], 403);
        }
    }

    public function absent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|string',
            'office' => 'required|int',
            'lat' => 'required|numeric',
            'lon' => 'required|numeric'
        ]);
        if($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Invalid fields',
                'errors' => $validator->errors()
            ], 422);
        }

        $isAbsent = Attendance::where('user_id', $request->user()->id)
            ->where('date', Carbon::now()->toDateString())
            ->where('status', 'absen')
            ->first();

        if($isAbsent) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'You have been absent today'
            ], 403);
        }

        $data = $request;
        $data['image'] = base64_decode(preg_replace('/^data:image\/\w+;base64,/', '', $data->image));

        // Simpan sementara image dari base64 ke storage
        $tempImage = 'photos/temp_image.png';
        Storage::disk('public')->put("{$tempImage}", $data->image);;

        $reference_image = storage_path('app/public/' . $request->user()->face_img);

        $projectRoot = base_path();
        $scriptPath = '../py/main.py';
        $command = "cd {$projectRoot} && python {$scriptPath} " . escapeshellarg($reference_image) . " " . escapeshellarg(storage_path("app/public/{$tempImage}"));

        $output = json_decode(exec($command), true);

        if (Storage::disk('public')->exists($tempImage)) {
            Storage::disk('public')->delete($tempImage);
        }

        if($output['status'] === 'successful') {
            $absent = Attendance::create([
                'user_id' => $request->user()->id,
                'date' => Carbon::now()->toDateString(),
                'work_start_time' => Carbon::now()->toTimeString(),
                'user_latitude' => $request->lat,
                'user_longitude' => $request->lon,
                'office_id' => $request->office,
            ]);
            return response()->json([
                'status' => 'successful',
                'message' => 'Success absent',
                'data' => $absent
            ], 200);
        } else {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Failed absent'
            ], 403);
        }
    }

    public function storePermit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reason' => 'required|string'
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Invalid fields',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();

        $permit = Permit::where('user_id', $request->user()->id)->where('date', Carbon::now()->toDateString())->first();

        if($permit) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'You have been requested permit today'
            ], 403);
        }

        $permit = Permit::create([
            'user_id' => $request->user()->id,
            'reason' => $data['reason'],
            'leader_id' => $request->user()->leader_id,
            'date' => Carbon::now()->toDateString()
        ]);

        return response()->json([
            'status' => 'successful',
            'message' => 'Permit successfuly added',
            'data' => $permit
        ], 200);
    }

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
        return response()->json([
            'status' => 'successful',
            'message' => 'Permit successfuly approved',
            'data' => $permit
        ], 200);
    }

    public function leave(Request $request)
    {
        $attendance = Attendance::where('user_id', $request->user()->id)
            ->where('date', Carbon::now()->toDateString())
            ->where('status', 'absen')
            ->first();

        if(!$attendance) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'You have not been absent today'
            ], 403);
        }

        $attendance->update([
            'status' => 'leave',
            'work_end_time' => Carbon::now()->toTimeString()
        ]);

        return response()->json([
            'status' => 'successful',
            'message' => 'Success leave',
            'data' => $attendance
        ], 200);
    }

    public function getPresence(Request $request)
    {
        $absent = Attendance::where('user_id', $request->user()->id)->where('status', '!=', 'alfa')->get();
        $permit = Permit::where('user_id', $request->user()->id)->where('is_approve', true)->get();
        $alfa = Attendance::where('user_id', $request->user()->id)->where('status', 'alfa')->get();
        $telat = Attendance::with(['office'])->where('user_id', $request->user()->id)->where('status', '!=', 'alfa')->get();

        foreach($telat as $key => $value) {
            $time = Carbon::parse($value->office->work_start_time);
            $time2 = Carbon::parse($value->work_start_time);
            if($time2->gt($time)) {
                $telat[$key]['telat'] = $time2->diffInMinutes($time);
            } else {
                $telat[$key]['telat'] = 0;
            }
        }

        dd($telat);

        return response()->json([
            'status' => 'successful',
            'message' => 'Success get presence',
            'data' => [
                'absent' => $absent,
                'permit' => $permit,
                'alfa' => $alfa,
                'telat' => $telat
            ]
        ], 200);
    }
}
