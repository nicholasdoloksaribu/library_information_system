<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Borrowing extends Model
{
    use HasFactory;

    protected $table = 'borrowings';

    protected $primaryKey = 'id_peminjaman';

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
    
    public function fine()
    {
        return $this->hasOne(Fine::class, 'id_peminjaman', 'id_peminjaman');
    }
 

    
}
