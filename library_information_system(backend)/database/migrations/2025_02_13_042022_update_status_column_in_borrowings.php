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
        Schema::table('borrowings', function (Blueprint $table) {
            //
            $table->enum('status', ['dipinjam', 'dikembalikan','pending','ditolak','telat'])->default('pending')->nullable()->change();
            $table->unsignedTinyInteger('rating')->nullable()->after('kode_buku')->comment('Rating dari 1-5');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('borrowings', function (Blueprint $table) {
            //
        });
    }
};
