<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_buku';

    protected $fillable = 
    [
    'judul',
    'pengarang',
    'penerbit',
    'stok', 
    'cover_buku',
    'lantai',
    'rak',
    'deskripsi',
    'kategori'
]; 

}
