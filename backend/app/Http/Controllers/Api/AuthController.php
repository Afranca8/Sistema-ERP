<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required',
            'password' => 'required',
        ]);

        // Busca pelo campo 'login' (não 'email')
        $user = User::where('login', $request->email)->first();

        if (! $user || ! password_verify($request->password, $user->senha)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais informadas não conferem.'],
            ]);
        }

        $user->tokens()->delete();

        // Busca o perfil na tabela tipo_usuarios
        $perfil = 'atendente';
        if ($user->tipoUsuario) {
            $perfil = strtolower($user->tipoUsuario->descricao ?? 'atendente');
        }

        return response()->json([
            'user'  => [
                'id'     => $user->id_usuario,
                'nome'   => $user->nome,
                'email'  => $user->login,
                'perfil' => $perfil,
            ],
            'token' => $user->createToken('api-token')->plainTextToken,
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        $perfil = 'atendente';
        if ($user->tipoUsuario) {
            $perfil = strtolower($user->tipoUsuario->descricao ?? 'atendente');
        }

        return response()->json([
            'id'     => $user->id_usuario,
            'nome'   => $user->nome,
            'email'  => $user->login,
            'perfil' => $perfil,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout realizado com sucesso.']);
    }
}