<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Borrowing;
use Carbon\Carbon;
use Faker\Factory as Faker;

class BorrowingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Daftar id siswa dan kode buku yang tersedia di database
        $id_siswa_list = range(1, 13); // sesuaikan jumlah siswa yang ada
        $kode_buku_list = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110 ]; // sesuaikan dengan kode buku yang ada di tabel books

        foreach (range(1, 30) as $i) {
            Borrowing::create([
                'id_siswa' => $faker->randomElement($id_siswa_list),
                'kode_buku' => $faker->randomElement($kode_buku_list),
                'tanggal_pinjam' => Carbon::now()->subDays(rand(1, 30)),
                'tanggal_pengembalian' => Carbon::now()->addDays(rand(1, 14)),
                'rating' => $faker->numberBetween(1, 5),
            ]);
        }
    }
}
