<?php

namespace App\Console\Commands;

use App\Models\Permit;
use Carbon\Carbon;
use Illuminate\Console\Command;

class checkPermits extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-permits';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $permits = Permit::where('date', Carbon::now()->toDateString())->where('status', 'pending')->get();

        foreach($permits as $permit) {
            $permit->update([
                'status' => 'denied',
                'bod_reason' => "Permintaan perizinan ini secara otomatis ditolak karena melewati batas waktu pengajuan. Pastikan atasan Anda menyetujui atau menolak permintaan izin sebelum tanggal izin berlaku untuk menghindari penolakan otomatis oleh sistem."
            ]);
        }
    }
}
