<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('borrowings', function (Blueprint $table) {
            $table->bigIncrements('id_peminjaman');
            $table->unsignedBigInteger('id_siswa');
            $table->date('tanggal_pinjam');
            $table->date('tanggal_pengembalian');
            $table->enum('status', ['dipinjam', 'dikembalikan'])->default('dipinjam')->nullable();
            $table->string('kode_buku');

            $table->timestamps();

            $table->foreign('kode_buku', 'fk_borrowings_kode_buku')->references('kode_buku')->on('books')->onDelete('cascade');
            $table->foreign('id_siswa', 'fk_borrowings_id_siswa')->references('id_siswa')->on('students')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('borrowings');
    }
};
