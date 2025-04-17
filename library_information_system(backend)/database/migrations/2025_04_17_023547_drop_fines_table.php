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
        //
        Schema::dropIfExists('fines');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::create('fines', function (Blueprint $table) {
            $table->bigIncrements('id_denda');
            $table->string('kode_buku');
            $table->unsignedBigInteger('id_peminjaman');
            $table->integer('jumlah_denda');
            $table->enum('status', ['belum_bayar', 'sudah_bayar'])->default('belum_bayar');
            $table->date('tanggal_bayar');
            $table->date('tanggal_kembali');
            $table->timestamps();

            // Menambahkan foreign key
            $table->foreign('kode_buku')->references('kode_buku')->on('books')->onDelete('cascade');
            $table->foreign('id_peminjaman')->references('id_peminjaman')->on('borrowings')->onDelete('cascade');
        });
    }
};
