<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Staff extends Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $table = 'staff';
    protected $primaryKey = 'id_staff';


    protected $fillable = [
        'name',
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

    protected $casts = [
        'tanggal_daftar' => 'datetime',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];





}
