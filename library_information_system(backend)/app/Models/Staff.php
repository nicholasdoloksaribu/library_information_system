<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    use HasFactory;

    protected $table = 'staff';


    protected $fillable = [
        'nama',
        'email',
        'no_telepon',
        'foto_profil',
        'tanggal_daftar',
        'password',
    ];

    public function activities()
    {
        return $this->hasMany(Activity_Staff::class);
    }




}
