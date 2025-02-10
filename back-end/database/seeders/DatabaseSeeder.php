<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Division;
use App\Models\Office;
use App\Models\User;
use App\Models\Schedule;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        Office::create([
            'name' => 'Enkripa - Haji Nawi',
            'latitude' => -6.263425131989862,
            'longitude' => 106.78862020452657,
            'radius' => 100
        ]);
        // User::create([
        //     'email' => 'agungpranomo@gmail.com',
        //     'username' => 'Agung Pranomo',
        //     'password' => bcrypt('AgungPranomo'),
        //     'face_img' => 'photos/agung.jpg',
        //     'role' => 'bod'
        // ]);
        User::create([
            'email' => 'nabilkeren590@gmail.com',
            'username' => 'Agung Pranomo',
            'password' => bcrypt('AgungPranomo'),
            'face_img' => 'photos/agung.jpg',
            'role' => 'bod'
        ]);
        Division::create([
            'name' => 'bod',
            'user_id' => 1
        ]);
        User::create([
            'email' => 'nabilkeren@gmail.com',
            'username' => 'Nabil Kevin',
            'password' => bcrypt('NabilKevin'),
            'leader_id' => 1
        ]);
        User::create([
            'email' => 'nabilkevin590@gmail.com',
            'username' => 'Nabil K',
            'password' => bcrypt('NabilK'),
            'role' => 'admin'
        ]);
        Division::create([
            'user_id' => 2,
        ]);
        Schedule::create([
            'office_id' => 1,
            'check_in_time' => '10:00:00',
            'check_out_time' => '18:00:00',
            'expired_date' => null,
            'status' => 'active'
        ]);
        for($i=0; $i<7; $i++) {
            // Waktu awal (jam 9)
            $start_time = Carbon::now()->setTime(8, 0, 0);

            // Selisih waktu antara jam 9 dan 10 dalam detik
            $time_difference_in_seconds = 3 * 60 * 60; // 1 jam = 60 menit * 60 detik

            // Generate angka random dalam rentang 0 hingga selisih waktu
            $random_seconds = rand(0, $time_difference_in_seconds);

            // Tambahkan detik acak ke waktu awal
            $random_time = $start_time->addSeconds($random_seconds);

            $start_time1 = Carbon::now()->setTime(18, 0, 0);

            // Selisih waktu antara jam 9 dan 10 dalam detik
            $time_difference_in_seconds1 = 60 * 60; // 1 jam = 60 menit * 60 detik

            // Generate angka random dalam rentang 0 hingga selisih waktu
            $random_seconds1 = rand(0, $time_difference_in_seconds1);

            // Tambahkan detik acak ke waktu awal
            $random_time1 = $start_time1->addSeconds($random_seconds1);
            Attendance::create([
                'user_id' => 2,
                'date' => '2025-02-0' . $i+1,
                'check_in_time' => $random_time->format('H:i:s'),
                'check_out_time' => $random_time1->format('H:i:s'),
                'status' => 'pulang',
                'work_type' => 'wfo',
                'user_latitude' => -6.263713982986026,
                'user_longitude' => 106.78952510559422,
                'office_id' => 1
            ]);
        }
    }
}
