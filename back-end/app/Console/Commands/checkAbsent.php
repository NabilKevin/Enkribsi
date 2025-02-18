<?php

namespace App\Console\Commands;

use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class checkAbsent extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-absent';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mengecek absensi apakah di hari itu user sudah absen, jika belum maka akan di alfakan';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $usersNotPresence = User::whereDoesntHave('attendances', function ($query) {
            $query->where('date', Carbon::now()->toDateString());
        })->get();
        foreach($usersNotPresence as $user) {
            Attendance::create([
                'status' => 'alfa',
                'date' => Carbon::now()->toDateString(),
                'user_id' => $user->id
            ]);
        }

    }
}
