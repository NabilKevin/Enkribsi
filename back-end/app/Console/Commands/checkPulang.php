<?php

namespace App\Console\Commands;

use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Console\Command;

class checkPulang extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-pulang';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mengecek pulang apakah di hari itu user sudah absen dan belum pulang, jika belum maka akan di auto pulang';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $absents = Attendance::where('date', Carbon::now()->toDateString())->where('status', 'absen')->get();
        foreach($absents as $absent) {
            $absent->update([
                'status' => 'pulang',
                'check_out_time' => Carbon::now()->toTimeString()
            ]);
        }

    }
}
