<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function borrowings() : HasMany
    {
        return $this->hasMany(Borrowing::class);
    }

    public function ratings() : HasMany
    {
        return $this->hasMany(Rating::class,'kode_buku','kode_buku');
    }

    public function getAverageRatingAttribute()
{
    $total = $this->ratings->sum('rating');
    $count = $this->ratings->count();

    return $count > 0 ? round($total / $count, 2) : 0;
}
    



}
