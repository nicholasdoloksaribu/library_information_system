<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $students = [
            [
                'name' => 'Andi Wijaya',
                'email' => 'andi@example.com',
                'no_telepon' => '081234567890',
                'password' => Hash::make('Andi-123'),
                'tanggal_daftar' => now(),
                'foto_profil' => null,
                'status' => 'approved'
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@example.com',
                'no_telepon' => '081298765432',
                'password' => Hash::make('Budi-123'),
                'tanggal_daftar' => now(),
                'foto_profil' => null,
                'status' => 'approved'
            ],
        ];

        foreach ($students as $student) {
            Student::create($student);
        }
    }
}
