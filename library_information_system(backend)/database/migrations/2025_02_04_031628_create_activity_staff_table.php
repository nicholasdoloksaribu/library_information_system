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
        Schema::create('activity_staff', function (Blueprint $table) {
            $table->bigIncrements('id_activity'); // Primary key
            
            // Foreign key ke tabel staff
            $table->unsignedBigInteger('id_staff');
            $table->foreign('id_staff')->references('id_staff')->on('staff')->onDelete('cascade');
            
            // Foreign key ke tabel students (opsional)
            $table->unsignedBigInteger('id_siswa')->nullable();
            $table->foreign('id_siswa')->references('id_siswa')->on('students')->onDelete('cascade');

            $table->unsignedBigInteger('id_peminjaman')->nullable();
            $table->foreign('id_peminjaman')->references('id_peminjaman')->on('borrowings')->onDelete('cascade');

            // Foreign key ke tabel books (kode_buku bertipe string)
            $table->string('kode_buku')->nullable();
            $table->foreign('kode_buku')->references('kode_buku')->on('books')->onDelete('cascade');

            $table->text('aktivitas');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_staff');
    }
};
