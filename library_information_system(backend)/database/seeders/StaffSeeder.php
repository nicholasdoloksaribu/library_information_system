<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Staff;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class StaffSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $faker = Faker::create();

        for ($i = 0; $i < 10; $i++) {
            Staff::create([
                'name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'no_telepon' => $faker->phoneNumber,
                'foto_profil' => null, // karena nullable
                'tanggal_daftar' => $faker->date(),
                'password' => Hash::make('password123'), // default password
            ]);
        }
    }
}
