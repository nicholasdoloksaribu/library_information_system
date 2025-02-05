<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $table = 'books';

    protected $fillable = 
    [
    'kode_buku',
    'judul',
    'pengarang',
    'penerbit',
    'tahun_terbit',
    'foto_buku',
    'deskripsi',
    'stok', 
    'lantai',
    'rak',
    'kategori'
]; 

    public function borrowings()
    {
        return $this->hasMany(Borrowing::class);
    }
    



}
