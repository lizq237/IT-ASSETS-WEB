<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    
      // Crear un nuevo usuario asociado a la organización (HU-02).
     
    public function store(Request $request)
    {
        // Validar la entrada de datos
        $validator = Validator::make($request->all(), [
            'name'            => 'required|string|max:255',
            'email'           => 'required|string|email|max:255|unique:users',
            'password'        => 'required|string|min:8',
            'role'            => 'required|string|in:admin_ti,tecnico,empleado',
            'organization_id' => 'required|string', // Se asocia obligatoriamente a la organización
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        // Crear el usuario
        $user = User::create([
            'name'            => $request->name,
            'email'           => $request->email,
            'password'        => Hash::make($request->password),
            'role'            => $request->role,
            'organization_id' => $request->organization_id,
        ]);

        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'user'    => $user
        ], 201);
    }

     // Listar usuarios pertenecientes a la organización.
     
    public function index(Request $request)
    {
        $organizationId = $request->query('organization_id');

        if ($organizationId) {
            $users = User::where('organization_id', $organizationId)->get();
        } else {
            $users = User::all();
        }

        return response()->json($users, 200);
    }
}
