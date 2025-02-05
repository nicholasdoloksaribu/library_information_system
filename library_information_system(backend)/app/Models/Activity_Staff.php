<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity_Staff extends Model
{
    use HasFactory;

    protected $table = 'activity_staff';

    protected $fillable = [
        'id_staff',
        'id_siswa',
        'kode_buku',
        'aktivitas',
    ];

    public function staff()
    {
        return $this->belongsTo(Staff::class, 'id_staff', 'id_staff');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'id_siswa', 'id_siswa');
    }

    public function book()
    {
        return $this->belongsTo(Book::class, 'kode_buku', 'kode_buku');
    }

    
    
}
