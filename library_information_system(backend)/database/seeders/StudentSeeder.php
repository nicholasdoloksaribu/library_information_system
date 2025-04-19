<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Misalnya kita mau generate 10 siswa
        for ($i = 0; $i < 10; $i++) {
            Student::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'no_telepon' => $faker->phoneNumber,
                'password' => Hash::make('password123'),
                'tanggal_daftar' => now(),
                'foto_profil' => null,
                'status' => 'approved'
            ]);
        }
    }
}
