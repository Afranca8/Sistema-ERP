<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';

    protected $fillable = [
        'nome', 'login', 'senha', 'id_tipo',
    ];

    protected $hidden = [
        'senha',
    ];

    public function getAuthPassword()
    {
        return $this->senha;
    }

    public function tipoUsuario()
    {
        return $this->belongsTo(TipoUsuario::class, 'id_tipo');
    }
}