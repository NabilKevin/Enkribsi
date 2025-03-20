<?php

namespace App\Console\Commands;

use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class reminderAbsen extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:reminder-absen';

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
        $users = User::where('role', '!=', 'admin')->get();
        $isNotAbsen = [];
        foreach($users as $user) {
            $absent = Attendance::with(['office.schedules' => function ($query) {
                $query->where('status', 'active')->limit(1);
            }])->where('user_id', $user->id)
                ->where('status', 'absen')
                ->where(function ($query) {
                    $query->whereNull('check_out_time')
                        ->orWhere('date', Carbon::now()->toDateString());
                })
            ->first();

            if(!$absent) {
                $isNotAbsen[] =  $user;
            }
        }
        foreach($isNotAbsen as $user) {
            $dataMail = [
                'subject' => "[REMINDER] Pengingat absen",
                'username' => $user->username,
                'view' => 'reminder.index',
                'content' => 'Hari ini kamu belum absen! segera absen ya!'
            ];

            sendEmail($user->email, $dataMail);
        }
    }
}
