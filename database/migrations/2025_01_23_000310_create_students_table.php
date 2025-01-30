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
        Schema::create('students', function (Blueprint $table) {
            $table->bigIncrements('id_siswa');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('no_telepon');
            $table->string('foto_profil')->nullable();
            $table->date('tanggal_daftar');
            $table->string('password');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
