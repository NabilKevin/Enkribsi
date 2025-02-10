<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Permit;
use Carbon\Carbon;
use Illuminate\Http\Request;

// buat announcement
// buat jadwal
// buat office
// cek semua status pegawai
// buat laporan semua pegawai per: 1 hari, 1 minggu, 1 bulan
// buat jadwal wfa/wfh

class HrController extends Controller
{
    public function getTodayPermits(Request $request)
    {
        return response()->json([
            'status' => 'successful',
            'message' => 'Successfully get permits',
            'data' => Permit::where('date', Carbon::now()->toDateString())
        ], 200);
    }
}
