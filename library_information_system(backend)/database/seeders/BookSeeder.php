<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        Book::insert([
            [
                'kode_buku' => '1',
                'judul' => 'Pemrograman Laravel',
                'pengarang' => 'Nicholas Doloksaribu',
                'penerbit' => 'Informatika Bandung',
                'tahun_terbit' => '2023',
                'call_number' => '005.1 NIC p',
                'deskripsi' => 'Buku ini membahas Laravel dari dasar hingga mahir.',
                'isbn' => '9786021234567',
                'foto_buku' => 'laravel.jpg',
                'stok' => 5,
                'rak' => 'A1',
                'kategori' => 'Teknologi',
            ],
            [
                'kode_buku' => '2',
                'judul' => 'Dasar-dasar Matematika Diskrit',
                'pengarang' => 'Budi Santoso',
                'penerbit' => 'Graha Ilmu',
                'tahun_terbit' => '2022',
                'call_number' => '510 BUD d',
                'deskripsi' => 'Penjelasan lengkap konsep matematika diskrit.',
                'isbn' => '9786022345678',
                'foto_buku' => 'matdis.jpg',
                'stok' => 3,
                'rak' => 'B2',
                'kategori' => 'Matematika',
            ],
            [
                'kode_buku' => '3',
                'judul' => 'Pengantar Kecerdasan Buatan',
                'pengarang' => 'Sari Lestari',
                'penerbit' => 'DeepPublish',
                'tahun_terbit' => '2024',
                'call_number' => '006 SAR p',
                'deskripsi' => 'Memahami konsep dasar Artificial Intelligence.',
                'isbn' => '9786023456789',
                'foto_buku' => 'ai.jpg',
                'stok' => 4,
                'rak' => 'C3',
                'kategori' => 'Teknologi',
            ],
        ]);
    }
}
