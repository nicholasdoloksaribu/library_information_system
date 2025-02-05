<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    use HasFactory;

    protected $table = 'ratings';

    protected $fillable = [
        'kode_buku',
        'id_siswa',
        'rating',
    ];

    public function book()
    {
        return $this->belongsTo(Book::class, 'kode_buku', 'kode_buku');
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'id_siswa', 'id_siswa');
    }

    
}
