<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fine extends Model
{
    use HasFactory;

    protected $table = 'fines';

    protected $fillable = [
        'id_peminjaman',
        'jumlah_denda',
        'status',
        'tanggal_bayar'
    ];

    public function borrowing()
    {
        return $this->belongsTo(Borrowing::class, 'id_peminjaman', 'id_peminjaman');
    }

    

}
