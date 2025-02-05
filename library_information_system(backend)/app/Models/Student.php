<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $table = 'students';
    protected $primaryKey = 'id_siswa';

    protected $fillable = [
        'nama',
        'email',
        'no_telepon',
        'foto_profil',
        'tanggal_daftar',
        'password',
        'status',
    ];

    public function borrowings()
    {
        return $this->hasMany(Borrowing::class, 'id_siswa', 'id_siswa');
    }

    public function fines()
    {
        return $this->hasManyThrough(Fine::class, Borrowing::class, 'id_siswa', 'id_peminjaman', 'id_siswa', 'id_peminjaman');
    }
    
    public function activity_staff()
    {
        return $this->hasMany(Activity_Staff::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class, 'id_siswa', 'id_siswa');
    }
    
}
