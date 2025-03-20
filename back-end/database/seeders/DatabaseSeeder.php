<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Division;
use App\Models\Office;
use App\Models\User;
use App\Models\Permit;
use App\Models\Schedule;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

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
            'radius' => 100,
            'work_type' => 'wfo',
            'status' => 'active'
        ]);
        Office::create([
            'name' => 'Rumah',
            'latitude' => -6.273889593688647,
            'longitude' => 106.84985596663225,
            'radius' => 100,
            'work_type' => 'wfh',
            'status' => 'active'
        ]);
        User::create([
            'email' => 'nabilkeren3000@gmail.com',
            'username' => 'Agung Pranomo',
            'password' => bcrypt('AgungPranomo'),
            'face_img' => 'photos/agung.jpg',
            'role' => 'bod'
        ]);

        Division::create(attributes: [
            'name' => 'bod',
            'user_id' => 1
        ]);
        User::create([
            'email' => 'nabilkevin3000@gmail.com',
            'username' => 'Hanny',
            'password' => bcrypt('HannyEnkripa'),
            'face_img' => 'photos/hanny.jpg',
            'leader_id' => 1,
            'role' => 'hr'
        ]);
        User::create([
            'email' => 'nabilkeren@gmail.com',
            'username' => 'Nabil Kevin',
            'password' => bcrypt('NabilKevin'),
            'leader_id' => 1,
            'face_img' => 'photos/1741063632.jpg'
        ]);
        User::create([
            'email' => 'nabilkevin590@gmail.com',
            'username' => 'Nabil K',
            'password' => bcrypt('NabilK'),
            'role' => 'admin'
        ]);
        Division::create([
            'name'=> 'hr',
            'user_id' => 2,
        ]);
        Division::create([
            'user_id' => 3,
        ]);
        Schedule::create([
            'office_id' => 1,
            'check_in_time' => '10:00:00',
            'check_out_time' => '18:00:00',
            'expired_date' => null,
            'status' => 'active'
        ]);
        Schedule::create([
            'office_id' => 2,
            'check_in_time' => '10:00:00',
            'check_out_time' => '18:00:00',
            'expired_date' => null,
            'status' => 'active'
        ]);
        $faker = Faker::create();
        for($ii=0; $ii<3; $ii++) {
            for($iii = 0; $iii < 3; $iii++) {
                for($i=0; $i<30; $i++) {
                    if($iii === 0 || $iii === 1 && $i < 28 || $iii === 2 && $i < 13) {
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

                        $date = '2025-0' . $iii + 1 . '-';
                        if($i<10) {
                            $date .= '0';
                        }
                        $date .=  $i+1;

                        $rand = rand(1, 2);
                        if($rand === 1) {
                            Attendance::create([
                                'user_id' => $ii + 1,
                                'date' => $date,
                                'check_in_date' => $date,
                                'check_out_date' => $date,
                                'check_in_time' => $random_time->format('H:i:s'),
                                'check_out_time' => $random_time1->format('H:i:s'),
                                'status' => 'pulang',
                                'work_type' => 'wfo',
                                'check_in_latitude' => -6.263713982986026,
                                'check_in_longitude' => 106.78952510559422,
                                'check_out_latitude' => -6.263713982986025,
                                'check_out_longitude' => 106.78952510559420,
                                'office_id' => 1
                            ]);
                        } else {
                            $rand = rand(0,1);
                            $type = ['alfa', 'izin'];
                            if($rand === 1 && $ii !== 0) {
                                Permit::create([
                                    'user_id' => $ii+1,
                                    'office_id' => 1,
                                    'date' => $date,
                                    'permit_type' => 'sakit',
                                    'reason' => $faker->sentence(),
                                    'status' => 'approved'
                                ]);
                            }
                            Attendance::create([
                                'user_id' => $ii + 1,
                                'date' => $date,
                                'status' => $type[$rand],
                            ]);
                        }
                    }
                }
            }
        }
    }
}
