<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Permit;
use App\Models\Attendance;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\TodayPermitsResource;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

// Done:
// buat jadwal wfa/wfh
// buat jadwal
// buat office
// buat announcement
// buat laporan semua pegawai per: 1 hari, 1 minggu, 1 bulan
// cek semua statistik pegawai

class HrController extends Controller
{
    public function getTodayPermits()
    {
        return response()->json([
            'status' => 'successful',
            'message' => 'Successfully get permits',
            'data' => [
                'keys' => [
                     'user_username' => 'Pegawai',
                     'permit_type' => 'Jenis Izin',
                     'leader_username' => 'Atasan',
                     'office_name' => 'Kantor',
                     'reason' => 'Alasan',
                     'leader_reason' => 'Alasan Atasan (jika ditolak)',
                     'status' => 'Status',
                ],
                'permits' => TodayPermitsResource::collection(Permit::with(['user', 'leader.user', 'office'])->where('date', Carbon::now()->toDateString())->get())
            ]
        ], 200);
    }
    public function getEmployees(Request $request)
    {
        $order = in_array(Str::lower($request->order),['desc', 'asc']) ? Str::lower($request->order) : 'asc';

        $page = max(1, intval($request->input('page', 1)));
        $perPage = max(10, min(100, intval($request->input('per_page', 10))));

        $key = $request->search;

        return response()->json([
            'status' => 'successful',
            'message' => 'Successfully get employee(s)',
            'data' => User::select(['username', 'role'])->whereLike('username', "%$key%")->where('role', "user")->orderBy('id', $order)->paginate($perPage, ['*'], 'page', $page)
        ], 200);
    }
    private function validateDates($data, $addRule = []) {
        $rule = [
            'range' => 'in:daily,weekly,monthly|required_without_all:start_date,end_date',
            'start_date' => 'date|required_with:end_date',
            'end_date' => 'date|required_with:start_date'
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
    public function getEmployeeAttendance(Request $request, $id)   {
        $fail = $this->validateDates($request->all());
        if($fail) {
            return response()->json($fail, 422);
        }
        $date = $this->getDates($request);

        $user = User::find($id);

        if(!$user) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'User not found'
            ], 404);
        }

        $attendance = Attendance::where('user_id', $id)->whereBetween('date', [$date['startDate'], $date['endDate']])->get();

        if(Count($attendance)=== 0) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Attendance not found'
            ], 404);
        }

        return response()->json([
            'status' => 'successful',
            'message' => 'Successfully get attendance(s)',
            'data' => $attendance
        ], 200);
    }
    public function getAttendances(Request $request)
    {
        $fail = $this->validateDates($request->all());
        if($fail) {
            return response()->json($fail, 422);
        }
        $date = $this->getDates($request);

        $attendance = Attendance::whereBetween('date', [$date['startDate'], $date['endDate']])->get();

        if(Count($attendance)=== 0) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Attendance not found'
            ], 404);
        }

        return response()->json([
            'status' => 'successful',
            'message' => 'Successfully get attendances',
            'data' => $attendance
        ], 200);
    }
    public function makeReport(Request $request)
    {
        $fail = $this->validateDates($request->all(), [
            'user_id' => 'exists:users,id'
        ]);
        if($fail) {
            return response()->json($fail, 422);
        }

        $date = $this->getDates($request);

        $attendances = Attendance::with(['office.schedules', 'user'])
            ->when(isset($request->user_id), function ($query) use ($request) {
                $query->where('user_id', $request->user_id);
            })
            ->whereBetween('date', [$date['startDate'], $date['endDate']])
            ->get()
            ->sortBy('date', SORT_NATURAL, false)
            ->values();

        $absensi = [
            "Nama_Karyawan" => [],
            "Tanggal" => [],
            "Jam_Masuk" => [],
            "Jam_Pulang" => [],
            "Status_Kehadiran" => [],
            "Durasi_Kerja" => [],
            "Keterlambatan" => [],
        ];

        function formatTime($seconds) {
            $output = "";
            if ($seconds > 0) {
                $hours = floor($seconds / 3600);
                $minutes = floor(($seconds % 3600) / 60);
                $remainingSeconds = $seconds % 60;

                if ($hours > 0) {
                    $output .= "$hours jam ";
                }
                if ($minutes > 0) {
                    $output .= "$minutes menit ";
                }
                if ($remainingSeconds > 0) {
                    $output .= "$remainingSeconds detik ";
                }
            }
            return trim($output);
        }

        foreach ($attendances as $attendance) {
            $absensi["Nama_Karyawan"][] = $attendance->user->username;
            $absensi["Tanggal"][] = $attendance->date;
            $checkInTime = $attendance->check_in_time;
            $checkOutTime = $attendance->check_out_time;
            $absensi["Jam_Masuk"][] = $checkInTime;
            $absensi["Jam_Pulang"][] = $checkOutTime;

            $status = in_array($attendance->status, ['absen', 'pulang']) ? 'Hadir' : $attendance->status;
            $absensi["Status_Kehadiran"][] = $status;

            if ($checkInTime && $checkOutTime) {
                $durationInSeconds = Carbon::parse($checkInTime)->diffInSeconds(Carbon::parse($checkOutTime));
                $absensi["Durasi_Kerja"][] = formatTime($durationInSeconds);

                $schedule = $attendance->office->schedules->firstWhere('status', 'active');
                if ($schedule) {
                    $scheduledCheckIn = Carbon::parse($schedule->check_in_time);
                    $actualCheckIn = Carbon::parse($checkInTime);
                    $latenessInSeconds = max(0, $scheduledCheckIn->diffInSeconds($actualCheckIn));

                    $absensi["Keterlambatan"][] = $latenessInSeconds === 0
                        ? "Tidak telat"
                        : formatTime($latenessInSeconds);
                } else {
                    $absensi["Keterlambatan"][] = null;
                }
            } else {
                $absensi["Durasi_Kerja"][] = null;
                $absensi["Keterlambatan"][] = null;
            }
        }

        $rekap = [
            "Nama_Karyawan" => [],
            "Total_Hari_Kerja" => [],
            "Total_Hari_Hadir" => [],
            "Total_Hari_Tidak_Hadir" => [],
            "Total_Jam_Kerja" => [],
            "Total_Keterlambatan" => []
        ];

        $users = User::with('attendances.office.schedules')
        ->when(isset($request->user_id), function ($query) use ($request) {
            $query->find($request->user_id);
        })->where('role', "!=", 'admin')->get();

        foreach($users as $user) {
            $rekap['Nama_Karyawan'][] = $user->username;
            $rekap["Total_Hari_Kerja"][] = Count($user->attendances->whereBetween('date', [$date['startDate'], $date['endDate']]));
            $rekap["Total_Hari_Hadir"][] = Count($user->attendances->whereBetween('date', [$date['startDate'], $date['endDate']])->whereIn('status', ['absen', 'pulang']));
            $rekap["Total_Hari_Tidak_Hadir"][] = Count($user->attendances->whereBetween('date', [$date['startDate'], $date['endDate']])->whereNotIn('status', ['absen', 'pulang']));

            $totalJamKerja = 0;
            $totalKeterlambatan = 0;

            foreach($user->attendances as $attendance) {
                if(!empty($attendance->check_in_time) && !empty($attendance->check_out_time)) {
                    $totalJamKerja += Carbon::parse($attendance->check_in_time)->diffInSeconds(Carbon::parse($attendance->check_out_time));
                    $telat = Carbon::parse($attendance->office->schedules->firstWhere('status', 'active')->check_in_time)->diffInSeconds(Carbon::parse($attendance->check_in_time));

                    if($telat > 0) {
                        $totalKeterlambatan += $telat;
                    }
                }
            }

            $rekap["Total_Jam_Kerja"][] =formatTime($totalJamKerja);
            $rekap["Total_Keterlambatan"][] = formatTime($totalKeterlambatan);
        }

        $perizinan = [
            "Nama_Karyawan" => [],
            "Jenis_Pengajuan" => [],
            "Tanggal_Pengajuan" => [],
            "Tanggal_Izin" => [],
            "Alasan_Izin" => [],
            "Status_Pengajuan" => [],
            "Alasan_Ditolak" => [],
        ];

        $permits = Permit::with(['user'])
        ->when(isset($request->user_id), function ($query) use ($request) {
            $query->where('user_id', $request->user_id);
        })->whereBetween('date', [$date['startDate'], $date['endDate']])->get();

        foreach($permits as $permit) {
            $perizinan['Nama_Karyawan'][] = $permit->user->username;
            $perizinan['Jenis_Pengajuan'][] = $permit->permit_type;
            $perizinan['Tanggal_Pengajuan'][] = Carbon::parse($permit->created_at)->toDateString();
            $perizinan['Tanggal_Izin'][] = Carbon::parse($permit->date)->toDateString();
            $perizinan['Alasan_Izin'][] = $permit->reason;
            $perizinan['Status_Pengajuan'][] = $permit->status;
            $perizinan['Alasan_Ditolak'][] = $permit->bod_reason;
        }

        $pelanggaran = [
            "Nama_Karyawan" => [],
            "Tanggal" => [],
            "Pelanggaran" => []
        ];

        $violations = Attendance::with(['user'])
        ->when(isset($request->user_id), function ($query) use ($request) {
            $query->where('user_id', $request->user_id);
        })->where('status', 'alfa')->get();

        foreach($violations as $violation) {
            $pelanggaran['Nama_Karyawan'][] = $violation->user->username;
            $pelanggaran['Pelanggaran'][] = $violation->status;
            $pelanggaran['Tanggal'][] = Carbon::parse($violation->date)->toDateString();
        }

        $url = env("PYTHON_URL") . '/generateExcell';

        $data = [
            'absensi' => $absensi,
            'rekap' => $rekap,
            'perizinan' => $perizinan,
            'pelanggaran' => $pelanggaran
        ];

        $response = Http::post($url, $data);

        if ($response->failed()) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Gagal mengirim data ke server'
            ], $response->status());
        }
        $data = $response->json();
        return response()->json(['status' => 'successful', 'message' => 'Data berhasil diterima!', 'data' => $data]);
    }
}
