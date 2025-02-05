<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $judulIndonesia = [
            "Pemrograman Web dengan Laravel",
            "Belajar Machine Learning",
            "Dasar-Dasar Algoritma",
            "Kecerdasan Buatan untuk Pemula",
            "Data Science dengan Python",
            "Keamanan Jaringan Komputer",
            "Manajemen Basis Data",
            "Pemrograman Berorientasi Objek",
            "Sistem Informasi Manajemen",
            "Strategi Digital Marketing"
        ];


        $judul =  $this->faker->randomElement($judulIndonesia);
        return [
            //
            'kode_buku' => 'B' . $this->faker->unique()->numberBetween(100, 999),
            'judul' => $judul,
            'pengarang' => $this->faker->name(),
            'penerbit' => $this->faker->company(),
            'tahun_terbit' => $this->faker->year(),
            'deskripsi' => $this->faker->paragraph(),
            'foto_buku' => 'path/to/foto.jpg',
            'stok' => $this->faker->numberBetween(1, 20),
            'lantai' => $this->faker->randomElement(['1', '2', '3']),
            'rak' => $this->faker->randomLetter() . $this->faker->numberBetween(1, 10),
            'kategori' => $this->faker->word(),
        ];
    }
}
