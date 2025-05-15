<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Borrowing;
use Carbon\Carbon;
use Faker\Factory as Faker; 
use App\Models\Book; // Import the Book model
use App\Models\Borrowing; // Import the Borrowing model
use App\Models\Student; // Import the Student model


class BorrowingSeeder extends Seeder
{
    public function run(): void
    {
        $bookIds = Book::pluck('kode_buku')->toArray();
        $studentIds = Student::pluck('id_siswa')->toArray();

        if (empty($bookIds) || empty($studentIds)) {
            echo "No books or students found. Please seed the books and students tables first.\n";
            return;
        }

        for ($i = 0; $i < 30; $i++) {
            $randomBookId = $bookIds[array_rand($bookIds)];
            $randomStudentId = $studentIds[array_rand($studentIds)];

            Borrowing::create([
                'id_siswa' => $randomStudentId,
                'kode_buku' => $randomBookId,
                'tanggal_pinjam' => now(),
                'tanggal_pengembalian' => now()->addDays(rand(7, 14)),
                'rating' => rand(1, 5),
            ]);
        }
    }
}