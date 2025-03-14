<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Borrowing extends Model
{
    use HasFactory;

    protected $table = 'borrowing';

    protected $fillable = [
        'id_siswa', 
        'tanggal_pinjam', 
        'tanggal_pengembalian', 
        'status', 
        'kode_buku'
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
