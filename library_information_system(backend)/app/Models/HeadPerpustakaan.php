<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class HeadPerpustakaan extends Authenticatable
{
    use HasFactory, HasApiTokens;

    protected $table = 'headperpustakaan';

    protected $fillable = [
        'name',
        'email',
        'password',
        'no_telepon'
    ];

    protected $hidden = [
        'password',
    ];
    
}
