<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Office;
use App\Models\Permit;
use App\Models\Division;
use App\Models\Attendance;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\WfaWfhSchedule;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AbsenController extends Controller
{
    public function checkLocation(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'lat' => 'required|numeric',
            'lon' => 'required|numeric',
            'office' => 'required|int|exists:offices,id'
        ]);
        if($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
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
                'message' => 'Kamu berada di area kantor'
            ], 200);
        } else {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Kamu tidak berada di area kantor'
            ], 403);
        }
    }

    public function checkScheduleWfah(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'office' => 'required|int|exists:offices,id'
        ]);
        if($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Invalid fields',
                'errors' => $validator->errors()
            ], 422);
        }
        $now = Carbon::now()->toDateString();
        $schedule = WfaWfhSchedule::where('office_id', $request->office)->where('start_date', '>=', $now)->where('end_date', '<=', $now)->firstWhere('status', 'active');
        $permit = Permit::whereIn('permit_type', ['wfa', 'wfh'])->firstWhere('date',$now);
        if($schedule || $permit) {
            if($request->work_type === 'wfh') {
                if($permit) {
                    if($permit->permit_type === 'wfa') {
                        return response()->json([
                            'status' => 'unsuccessful',
                            'message' => "Kamu izin untuk WFA hari ini"
                        ], 403);
                    }
                }
                if($schedule) {
                    if($schedule->type === 'wfa') {
                        return response()->json([
                            'status' => 'unsuccessful',
                            'message' => "Hari ini jadwalnya untuk WFA"
                        ], 403);
                    }
                }
            } else {
                if($permit) {
                    if($permit->permit_type === 'wfh') {
                        return response()->json([
                            'status' => 'unsuccessful',
                            'message' => "Kamu izin untuk WFH hari ini"
                        ], 403);
                    }
                }
                if($schedule) {
                    if($schedule->type === 'wfh') {
                        return response()->json([
                            'status' => 'unsuccessful',
                            'message' => "Hari ini jadwalnya untuk WFH"
                        ], 403);
                    }
                }
            }
            return response()->json([
                'status' => 'successful',
                'message' => 'Kamu bisa WFA/WFH hari ini',
                'schedule' => $schedule
            ], 200);
        }
        return response()->json([
            'status' => 'unsuccessful',
            'message' => "Kamu tidak bisa WFA/WFH hari ini"
        ], 403);
    }

    public function absent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|string',
            'office' => 'required|int|exists:offices,id',
            'lat' => 'required|numeric',
            'lon' => 'required|numeric',
            'work_type' => 'required|string'
        ]);
        if($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Invalid fields',
                'errors' => $validator->errors()
            ], 422);
        }

        if(!$request->user()->face_img) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => "Kamu belum mengunggah foto referensimu"
            ], 403);
        }

        $isAbsent = Attendance::where('user_id', $request->user()->id)
            ->where('date', Carbon::now()->toDateString())
            ->first();

        $permit = Permit::where('user_id', $request->user()->id)
        ->where('date', Carbon::now()->toDateString())->first();

        if($isAbsent) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Kamu sudah absen hari ini'
            ], 403);
        }
        if($permit && in_array($permit->permit_type, ['izin', 'sakit'])) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Kamu telah izin hari ini'
            ], 403);
        }

        if(in_array($request->work_type, ['wfa', 'wfh'])) {
            $now = Carbon::now()->toDateString();
            $schedule = WfaWfhSchedule::where('office_id', $request->office)->where('start_date', '>=', $now)->where('end_date', '<=', $now)->firstWhere('status', 'active');
            if((!$permit || ($permit && in_array($permit->permit_type, ['izin', 'sakit']))) && !$schedule) {
                return response()->json([
                    'status' => 'unsuccessful',
                    'message' => "Kamu tidak bisa WFA/WFH hari ini"
                ], 403);
            }
            if($request->work_type === 'wfh') {
                if($permit) {
                    if($permit->permit_type === 'wfa') {
                        return response()->json([
                            'status' => 'unsuccessful',
                            'message' => "Kamu izin untuk WFA hari ini"
                        ], 403);
                    }
                }
                if($schedule) {
                    if($schedule->type === 'wfa') {
                        return response()->json([
                            'status' => 'unsuccessful',
                            'message' => "Hari ini jadwalnya untuk WFA"
                        ], 403);
                    }
                }
            } else {
                if($permit) {
                    if($permit->permit_type === 'wfh') {
                        return response()->json([
                            'status' => 'unsuccessful',
                            'message' => "Kamu izin untuk WFH hari ini"
                        ], 403);
                    }
                }
                if($schedule) {
                    if($schedule->type === 'wfh') {
                        return response()->json([
                            'status' => 'unsuccessful',
                            'message' => "Hari ini jadwalnya untuk WFH"
                        ], 403);
                    }
                }
            }
        }

        $data = $request->all();
        $reference_image = Storage::get($request->user()->face_img);

        $url = env("PYTHON_URL") . '/validasiwajah';

        $data = [
            'image1' => preg_replace('/^data:image\/\w+;base64,/', '', $data['image']),
            'image2' => base64_encode($reference_image)
        ];

        $response = Http::post($url, $data);

        if($response->successful()) {

            $absent = Attendance::create([
                'user_id' => $request->user()->id,
                'date' => Carbon::now()->toDateString(),
                'check_in_time' => Carbon::now()->toTimeString(),
                'work_type' => $request->work_type,
                'user_latitude' => $request->lat,
                'user_longitude' => $request->lon,
                'office_id'=>$request->office
            ]);
            return response()->json([
                'status' => 'successful',
                'message' => 'Success absent',
                'data' => $absent
            ], 200);
        } else {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => $response->json()['message']
            ], 403);
        }
    }

    public function storePermit(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reason' => 'required|string',
            'permit_type' => 'required|string',
            'date' => 'date|required',
            'office_id' => 'required|int|exists:offices,id',
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Invalid fields',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();

        $permit = Permit::where('user_id', $request->user()->id)->where('date', $data['date'])->where('status', "!=", 'canceled')->first();

        if($permit) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'You have been request permit in that date'
            ], 403);
        }
        if(Carbon::now()->toDateString() > Carbon::parse($data['date'])->toDateString()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => "You can't request leave for past dates"
            ], 403);
        }

        if(Carbon::now()->toDateString() === Carbon::parse($data['date'])->toDateString()) {
            if(in_array($data['permit_type'], ['wfh', 'wfa'])) {
                return response()->json([
                    'status' => 'unsuccessful',
                    'message' => "WFH/WFA requests must be submitted at least one day in advance"
                ], 403);
            }

            $bodDivision = Division::find($request->user()->leader_id);

            $bod = User::find($bodDivision->user_id);

            $username = $request->user()->username;

            $dataMail = [
                'subject' => "[URGENT] Permintaan Izin dari $username",
                'name' => $bod->username,
                'view' => 'permit.index',
                'employee' => [
                    'username' => $request->user()->username,
                    'date' => $data['date'],
                    'reason' => $data['reason'],
                    'status' => 'pending'
                ]
            ];

            sendEmail($bod->email, $dataMail);
        }

        $permit = Permit::create([
            'user_id' => $request->user()->id,
            'reason' => $data['reason'],
            'permit_type' => $data['permit_type'],
            'leader_id' => $request->user()->leader_id,
            'date' => $data['date'],
            'office_id' => $data['office_id']
        ]);

        return response()->json([
            'status' => 'successful',
            'message' => 'Permit successfuly added',
            'data' => $permit
        ], 200);
    }

    public function leave(Request $request)
    {
        $attendance = Attendance::with(['office.schedules'])->where('user_id', $request->user()->id)
            ->where('date', Carbon::now()->toDateString())
            ->where('status', 'absen')
            ->first();

        if(!$attendance) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => "Kamu belum absen hari ini"
            ], 403);
        }

        if(!Carbon::now()->gt($attendance->office->schedules->firstWhere('status', 'active')->check_out_time)) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => "Kamu tidak bisa pulang sebelum waktu pulang"
            ], 403);
        }

        $attendance->update([
            'status' => 'pulang',
            'check_out_time' => Carbon::now()->toTimeString()
        ]);

        return response()->json([
            'status' => 'successful',
            'message' => 'Selamat beristirahat',
            'data' => $attendance
        ], 200);
    }

    public function getPresencesCount(Request $request)
    {
        $absent = Attendance::where('user_id', $request->user()->id)->whereNotIn('status', ['izin', 'alfa'])->where('work_type', '!=', null)->get();
        $permit = Permit::where('user_id', $request->user()->id)->where('date', '<=', Carbon::now()->toDateString())->get();
        $alfa = Attendance::where('user_id', $request->user()->id)->where('status', 'alfa')->get();
        $telat = Attendance::with(['office.schedules'])->where('user_id', $request->user()->id)->whereNotIn('status', ['izin', 'alfa'])->where('work_type', '!=', null)->get();
        $telat = $telat->map(function($value) {
            $time = Carbon::parse($value->office->schedules->firstWhere('status' , 'active')->check_in_time);
            $time2 = Carbon::parse($value->check_in_time);
            if($time2->gt($time)) {
                $value->makeHidden(['office']);
                return $value;
            }
        })->filter();
        return response()->json([
            'status' => 'successful',
            'message' => 'Success get presence',
            'data' => [
                'hadir' => Count($absent),
                'izin' => Count($permit),
                'alfa' => Count($alfa),
                'telat' => Count($telat)
            ]
        ], 200);
    }

    public function getPresences(Request $request)
    {
        $absent = Attendance::orderBy('date', 'desc')->where('user_id', $request->user()->id)->where('work_type', '!=', null)->whereNotIn('status', ['izin', 'alfa'])->limit(50)->get();

        $permit = Permit::orderBy('date', 'desc')->where('user_id', $request->user()->id)->where('status', 'approved')->where('date', '<=', Carbon::now()->toDateString())->get();

        $alfa = Attendance::orderBy('date', 'desc')->where('user_id', $request->user()->id)->where('status', 'alfa')->get();

        $telat = Attendance::with(['office.schedules'])->orderBy('date', 'desc')->where('user_id', $request->user()->id)->whereNotIn('status',['izin', 'alfa'])->where('work_type', '!=', null)->get();
        $telat = $telat->map(function($value) {
            $time = Carbon::parse($value->office->schedules->firstWhere('status' , 'active')->check_in_time);
            $time2 = Carbon::parse($value->check_in_time);
            if($time2->gt($time)) {
                $value['check_in_time_schedule'] = $time->toTimeString();
                $value->makeHidden(['office']);
                return $value;
            }
        })->filter();

        return response()->json([
            'status' => 'successful',
            'message' => 'Success get presences',
            'data' => [
                'hadir' => $absent->sortBy('date', SORT_NATURAL, false)->values(),
                'izin' => $permit->sortBy('date', SORT_NATURAL, false)->values(),
                'alfa' => $alfa->sortBy('date', SORT_NATURAL, false)->values(),
                'telat' => $telat->sortBy('date', SORT_NATURAL, false)->values(),
            ]
        ], 200);
    }

    public function getAttendance(Request $request)
    {
        $absent = Attendance::with(['office.schedules' => function ($query) {
            $query->where('status', 'active')->limit(1);
        }])->where('user_id', $request->user()->id)->firstWhere('date', Carbon::now()->toDateString());
        if(!$absent) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => "You haven't been absent today"
            ], 404);
        }
        return response()->json([
            'status' => 'successful',
            'message' => 'Successfully get your attendance',
            'data' => $absent
        ], 200);
    }

    public function cancelPermit(Request $request, $id)
    {
        $permit = Permit::with(['office.schedules'])->find($id);

        if(!$permit) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Permit not found'
            ], 404);
        }

        if($permit->user_id !== $request->user()->id) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'This is not your permit'
            ], 403);
        }

        if(Carbon::now()->toDateString() > Carbon::parse($permit->date)->toDateString() || Carbon::now()->toDateString() === Carbon::parse($permit->date)->toDateString() && Carbon::now()->toTimeString() > Carbon::parse($permit->office->schedules->firstWhere('status', 'active')->check_out_time)->toTimeString()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => "You can't cancel your permit"
            ], 403);
        }
        $permit->update([
            'status' => 'canceled'
        ]);

        return response()->json([
            'status' => 'successful',
            'message' => 'Permit successfully canceled'
        ], 200);


    }
    public function getPermits(Request $request)
    {
        $permits = Permit::where('user_id', $request->user()->id)->get();
        return response()->json([
            'status' => 'successful',
            'message' => 'Successfully get permits',
            'data' => $permits
        ], 200);
    }

    public function getOffices()
    {
        return response()->json([
            'status' => 'successful',
            'message' => 'Permit successfuly added',
            'data' => Office::all()
        ], 200);
    }
}
