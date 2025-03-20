<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Office;
use App\Models\Permit;
use App\Models\Division;
use App\Models\Schedule;
use App\Models\Attendance;
use App\Models\Announcement;
use App\Models\Notification;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\AnnouncementResource;
use App\Http\Resources\HrAttendanceResource;
use App\Http\Resources\OfficeResource;
use App\Http\Resources\ScheduleResource;
use App\Http\Resources\TodayPermitsResource;
use App\Http\Resources\WfhScheduleResource;
use App\Models\WfhSchedule;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
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

        Notification::create([
            'user_id' => $permit->user_id,
            'title' => 'Perizinan Anda Telah Ditolak!',
            'excerpt' => "Pengajuan izin kerja Anda pada tanggal " . Carbon::parse($permit->date)->toDateString(),
            'content' => "<p>Pengajuan izin kerja Anda pada tanggal " . Carbon::parse($permit->date)->toDateString() ." belum dapat disetujui.</p> <p>Alasan: " . $request->bod_reason . ".</p> <p>Silakan hubungi atasan atau HRD untuk informasi lebih lanjut.</p><p>Terima kasih.</p>"
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
                'check_out_time' => in_array($permit->permit_type, ['izin', 'sakit']) ? Carbon::now()->toTimeString() : null
            ]);
        } else {
            if(Carbon::parse($permit->date)->isToday() && in_array($permit->permit_type, ['izin', 'sakit'])) {
                Attendance::create([
                    'user_id' => $permit->user_id,
                    'date' => Carbon::now()->toDateString(),
                    'status' => 'izin'
                ]);
            }
        }

        Notification::create([
            'user_id' => $permit->user_id,
            'title' => 'Perizinan Anda Telah Disetujui!',
            'excerpt' => "Pengajuan izin kerja Anda pada tanggal " . Carbon::parse($permit->date)->toDateString(),
            'content' => "<p>Pengajuan izin kerja Anda pada tanggal " . Carbon::parse($permit->date)->toDateString() ." telah disetujui.</p> <p>Silakan pastikan kembali rencana Anda sesuai dengan pengajuan.</p> <p>Terima kasih.</p>"
        ]);

        return response()->json([
            'status' => 'successful',
            'message' => 'Izin berhasil disetujui',
            'data' => $permit
        ], 200);
    }

    public function getPermits(Request $request)
    {
        $page = max(1, intval($request->input('page', 1)));
        $division = Division::firstWhere('user_id', $request->user()->id);
        $users = User::where('leader_id', $division->id)->get()->pluck('id');
        $permits = Permit::with('user')->whereIn('user_id', values: $users)->orderBy('date', 'asc')->paginate(10, ['*'], 'page', $page);
        TodayPermitsResource::collection($permits);
        return response()->json([
            'status' => 'successful',
            'message' => 'Successfully get permits',
            'data' => [
                'keys' => [
                     'user_username' => 'Pegawai',
                     'date' => 'Tanggal',
                     'permit_type' => 'Jenis Izin',
                     'leader_username' => 'Atasan',
                     'office_name' => 'Kantor',
                     'reason' => 'Alasan',
                     'leader_reason' => 'Alasan Atasan (jika ditolak)',
                     'status' => 'Status',
                ],
                'permits' => $permits
            ]
        ], 200);
    }

    public function getPermit(Request $request, $id)
    {
        $division = Division::firstWhere('user_id', $request->user()->id);
        $users = User::where('leader_id', $division->id)->get()->pluck('id');
        $permit = Permit::with('user')->whereIn('user_id', $users)->find($id);

        if(!$permit) {
            return response()->json([
                'message' => 'Izin tidak ditemukan',
                'status' => 'unsuccessful'
            ], 404);
        }

        return response()->json([
            'status' => 'successful',
            'message' => 'Izin berhasil didapatkan',
            'data' => $permit
        ], 200);
    }

    public function getAnnouncements(Request $request)
    {
        $page = max(1, intval($request->input('page', 1)));
        $announcements = Announcement::paginate(10, ['*'], 'page', $page);
        AnnouncementResource::collection($announcements);
        return response()->json([
            'status'=> 'successful',
            'message'=> 'Successfully get pending announcements',
            'data' => $announcements
        ], 200);
    }

    public function getAnnouncement($id)
    {
        $announcement = Announcement::find($id);
        if(!$announcement) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Announcement not found'
            ], 404);
        }
        return response()->json([
            'status' => 'successful',
            'message' => 'Annoucement gotten successful',
            'data' => new AnnouncementResource($announcement)
        ], 200);
    }

    public function approveAnnouncement(Request $request, $id)
    {
        $announcement = Announcement::find($id);

        if(!$announcement) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Announcement not found'
            ], 404);
        }

        if($announcement->status === 'approved') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Announcement has already been approved'
            ], 403);
        }
        if($announcement->status === 'denied') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Announcement has already been denied'
            ], 403);
        }

        $announcement->update([
            'status' => 'approved'
        ]);

        if($announcement->target_audience) {
            $users = User::where('leader_id', $announcement->target_audience)->get();
            foreach($users as $user) {
                Notification::create([
                    'user_id' => $user->id,
                    'title'=> $announcement->title,
                    'content'=> $announcement->content,
                    'excerpt' => substr(strip_tags($announcement->content), 0, 50)
                ]);
            }
        } else {
            $users = User::all();
            foreach($users as $user) {
                Notification::create([
                    'user_id' => $user->id,
                    'title'=> $announcement->title,
                    'content'=> $announcement->content,
                    'excerpt' => substr(strip_tags($announcement->content), 0, 50)
                ]);
            }
        }

        return response()->json([
            'status' => 'successful',
            'message' => 'Announcement successfully approved',
            'data' => $announcement
        ], 200);
    }

    public function denyAnnouncement(Request $request, $id)
    {
        $announcement = Announcement::find($id);

        if(!$announcement) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Announcement not found'
            ], 404);
        }

        if($announcement->status === 'approved') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Announcement has already been approved'
            ], 403);
        }
        if($announcement->status === 'denied') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Announcement has already been denied'
            ], 403);
        }

        $announcement->update([
            'status' => 'denied'
        ]);

        return response()->json([
            'status' => 'successful',
            'message' => 'Announcement successfully denied',
            'data' => $announcement
        ], 200);
    }
    public function getSchedules(Request $request)
    {
        $page = max(1, intval($request->input('page', 1)));
        $schedule = Schedule::paginate(10, ['*'], 'page', $page);
        ScheduleResource::collection($schedule);
        return response()->json([
            'status'=> 'successful',
            'message'=> 'Successfully get pending schedule',
            'data'=> $schedule,
        ], 200);
    }
    public function approveSchedule(Request $request, $id)
        {
        $schedule = Schedule::find($id); // Corrected method

        if (!$schedule) {
            return response()->json(
                [
                    'status' => 'unsuccessful',
                    'message'=> 'Schedule not found'
                ], 404);
        }

        if($schedule->status === 'approved') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Schedule has already been approved'
            ], 403);
        }
        if($schedule->status === 'denied') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Schedule has already been denied'
            ], 403);
        }

        $schedule->update(['status' => 'approved']);

        return response()->json(
        [
            'status' => 'successful',
            'message'=> 'Schedule successfully approved',
            'data' => $schedule
        ], 200);
    }
    public function denySchedule(Request $request, $id)
    {
        $schedule = Schedule::find($id);

        if(!$schedule) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Schedule not found'
            ], 404);
        }

        if($schedule->status === 'approved') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Schedule has already been approved'
            ], 403);
        }
        if($schedule->status === 'denied') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Schedule has already been denied'
            ], 403);
        }

        $schedule->update([
            'status' => 'denied'
        ]);

        return response()->json([
            'status' => 'successful',
            'message' => 'Schedule successfully denied',
            'data' => $schedule
        ], 200);
    }
    public function getWfhSchedules(Request $request)
    {
        $page = max(1, intval($request->input('page', 1)));
        $schedule = WfhSchedule::paginate(10, ['*'], 'page', $page);
        WfhScheduleResource::collection($schedule);
        return response()->json([
            'status'=> 'successful',
            'message'=> 'Successfully get pending wfh schedule',
            'data'=> $schedule,
        ], 200);
    }
    public function approveWfhSchedule(Request $request, $id)
        {
        $schedule = WfhSchedule::find($id); // Corrected method

        if (!$schedule) {
            return response()->json(
                [
                    'status' => 'unsuccessful',
                    'message'=> 'Wfh Schedule not found'
                ], 404);
        }

        if($schedule->status === 'approved') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Wfh Schedule has already been approved'
            ], 403);
        }
        if($schedule->status === 'denied') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Wfh Schedule has already been denied'
            ], 403);
        }

        $schedule->update(['status' => 'approved']);

        return response()->json(
        [
            'status' => 'successful',
            'message'=> 'Wfh Schedule successfully approved',
            'data' => $schedule
        ], 200);
    }
    public function denyWfhSchedule(Request $request, $id)
    {
        $schedule = WfhSchedule::find($id);

        if(!$schedule) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Wfh Schedule not found'
            ], 404);
        }

        if($schedule->status === 'approved') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Wfh Schedule has already been approved'
            ], 403);
        }
        if($schedule->status === 'denied') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Wfh Schedule has already been denied'
            ], 403);
        }

        $schedule->update([
            'status' => 'denied'
        ]);

        return response()->json([
            'status' => 'successful',
            'message' => 'Wfh Schedule successfully denied',
            'data' => $schedule
        ], 200);
    }

    public function getOffices(Request $request)
    {
        $page = max(1, intval($request->input('page', 1)));
        $office = Office::paginate(10, ['*'], 'page', $page);
        OfficeResource::collection($office);
        return response()->json([
            'status'=> 'successful',
            'message'=> 'Successfully get pending office',
            'data'=> $office,
        ], 200);
    }
    public function approveOffice(Request $request, $id)
    {
        $Office = Office::find($id);

        if(!$Office) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Office not found'
            ], 404);
        }

        if($Office->status === 'approved') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Office has already been approved'
            ], 403);
        }
        if($Office->status === 'denied') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Office has already been denied'
            ], 403);
        }

        $Office->update([
            'status' => 'approved'
        ]);

        return response()->json([
            'status' => 'successful',
            'message' => 'Office successfully approved',
            'data' => $Office
        ], 200);
    }
    public function denyOffice(Request $request, $id)
    {
        $Office = Office::find($id);

        if(!$Office) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Office not found'
            ], 404);
        }

        if($Office->status === 'approved') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Office has already been approved'
            ], 403);
        }
        if($Office->status === 'denied') {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Office has already been denied'
            ], 403);
        }

        $Office->update([
            'status' => 'denied'
        ]);

        return response()->json([
            'status' => 'successful',
            'message' => 'Office successfully denied',
            'data' => $Office
        ], 200);
    }


    public function getEmployees(Request $request)
    {
        $leader_id = Division::firstWhere('user_id', $request->user()->id);
        $order = in_array(Str::lower($request->order),['desc', 'asc']) ? Str::lower($request->order) : 'asc';

        $page = max(1, intval($request->input('page', 1)));
        $perPage = max(10, min(100, intval($request->input('per_page', 10))));

        $key = $request->search;

        return response()->json([
            'status' => 'successful',
            'message' => 'Successfully get employee(s)',
            'data' => User::where('leader_id', $leader_id->id)->whereLike('username', "%$key%")->where('role', '!=',  'admin')->orderBy('id', $order)->select('username')->paginate($perPage, ['*'], 'page', $page)
        ], 200);
    }
    private function validateDates($data, $addRule = []) {
        $rule = [
            'range' => 'in:daily,weekly,monthly|required_without_all:start_date,end_date',
            'start_date' => 'date|required_with:end_date',
            'end_date' => 'date|required_with:start_date|after_or_equal:start_date',
            'page' => 'int|min:1'
        ];

        $validator = Validator::make($data, array_merge($rule, $addRule));

        if($validator->fails()) {
            return [
                'status' => 'unsuccessful',
                'message' => 'Invalid field',
                'errors' => $validator->errors()
            ];
        }
    }
    private function getDates($data) {
        if(isset($data->range)) {
            return match($data->range) {
                'daily' => ['startDate' => Carbon::now()->toDateString(), 'endDate' => Carbon::now()->toDateString()],
                'weekly' => ['startDate' => Carbon::now()->subDays(7)->toDateString(), 'endDate' => Carbon::now()->toDateString()],
                'monthly' => ['startDate' => Carbon::now()->subDays(30)->toDateString(), 'endDate' => Carbon::now()->toDateString()]
            };
        }

        return ['startDate' => Carbon::parse($data->start_date)->toDateString(), 'endDate' => Carbon::parse($data->end_date)->toDateString()];
    }
    public function getEmployeeAttendance(Request $request, $username)   {
        $leader_id = Division::firstWhere('user_id', $request->user()->id);
        $fail = $this->validateDates($request->all());
        if($fail) {
            return response()->json($fail, 422);
        }
        $date = $this->getDates($request);
        $page = $request->input('page', 1);

        $user = User::firstWhere('username', $username);

        if(!$user) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'User not found'
            ], 404);
        }

        if($user->leader_id !== $leader_id->id) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Pegawai ini bukan bawahanmu'
            ], 403);
        }

        $attendance = Attendance::with(['office.schedules', 'user'])->where('user_id', $user->id)->whereBetween('date', [$date['startDate'], $date['endDate']]);

        $attendances = $attendance->get();

        if(Count($attendances)=== 0) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Kehadiran tidak di temukan'
            ], 404);
        }

        $attendance = $attendance->paginate(10, ['*'], 'page', $page);
        HrAttendanceResource::collection($attendance);

        return response()->json([
            'status' => 'successful',
            'message' => 'Successfully get attendance(s)',
            'data' => [
                'data' => $attendance,
                'hadir' => Count($attendances->whereIn('status', ['absen', 'pulang'])),
                'telat' => Count(
            $attendances->whereIn('status', ['absen', 'pulang'])
                    ->map(function($value) {
                        $time = Carbon::parse($value->office->schedules->firstWhere('status' , 'active')->check_in_time);
                        $time2 = Carbon::parse($value->check_in_time);
                        if($time2->gt($time)) {
                            $value->makeHidden(['office']);
                            return $value;
                        }
                    })->filter()),
                'izin' => Count($attendances->where('status', 'izin')),
                'alfa' => Count($attendances->where('status', 'alfa')),
                'start_date' => str_replace('-', '/',$date['startDate']),
                'end_date' => str_replace('-', '/',$date['endDate'])
            ]
        ], 200);
    }
    public function getAttendances(Request $request)
    {
        $leader_id = Division::firstWhere('user_id', $request->user()->id);
        $fail = $this->validateDates($request->all());
        if($fail) {
            return response()->json($fail, 422);
        }
        $date = $this->getDates($request);
        $page = $request->input('page', 1);

        $users = User::where('leader_id', $leader_id->id)->get()->pluck('id');

        $attendance = Attendance::with(['user', 'office.schedules'])->whereIn('user_id', $users)->whereBetween('date', [$date['startDate'], $date['endDate']])->orderBy('date', 'asc');

        $attendances = $attendance->get();

        if(Count($attendances)=== 0) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Kehadiran tidak di temukan'
            ], 404);
        }

        $attendance = $attendance->paginate(10, ['*'], 'page', $page);
        HrAttendanceResource::collection($attendance);

        return response()->json([
            'status' => 'successful',
            'message' => 'Successfully get attendances',
            'data' => [
                'data' => $attendance,
                'hadir' => Count($attendances->whereIn('status', ['absen', 'pulang'])),
                'telat' => Count(
            $attendances->whereIn('status', ['absen', 'pulang'])
                    ->map(function($value) {
                        $time = Carbon::parse($value->office->schedules->firstWhere('status' , 'active')->check_in_time);
                        $time2 = Carbon::parse($value->check_in_time);
                        if($time2->gt($time)) {
                            $value->makeHidden(['office']);
                            return $value;
                        }
                    })->filter()),
                'izin' => Count($attendances->where('status', 'izin')),
                'alfa' => Count($attendances->where('status', 'alfa')),
                'start_date' => str_replace('-', '/',$date['startDate']),
                'end_date' => str_replace('-', '/',$date['endDate'])
            ]
        ], 200);
    }
}
