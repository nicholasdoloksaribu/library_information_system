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
        Schema::dropIfExists('ratings');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->string('kode_buku');
            $table->foreign('kode_buku')->references('kode_buku')->on('books')->onDelete('cascade');
            $table->unsignedBigInteger('id_siswa');
            $table->foreign('id_siswa')->references('id_siswa')->on('students')->onDelete('cascade');
            $table->tinyInteger('rating')->unsigned()->comment('Rating dari 1-5');
            $table->timestamps();
        });
    }
};
