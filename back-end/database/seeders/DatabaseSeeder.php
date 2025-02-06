<?php

namespace Database\Seeders;

use App\Models\Division;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
        User::create([
            'email' => 'agungpranomo@gmail.com',
            'username' => 'Agung Pranomo',
            'password' => bcrypt('AgungPranomo'),
            'face_img' => 'photos/agung.jpg',
            'leader_id' => null,
            'role' => 'bod'
        ]);
        Division::create([
            'name' => 'bod',
            'user_id' => 1
        ]);
        User::create([
            'email' => 'nabilkeren590@gmail.com',
            'username' => 'Nabil Kevin',
            'password' => bcrypt('NabilKevin'),
            'face_img' => 'photos/nabil.jpg',
            'leader_id' => 1
        ]);
        Division::create([
            'user_id' => 2
        ]);
    }
}
