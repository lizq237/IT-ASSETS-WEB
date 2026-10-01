<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verificar si hay un usuario autenticado
        // Comprobar si su rol es 'admin_ti' o el campo/relación donde guarden el rol
        if (!$request->user() || $request->user()->role !== 'admin_ti') {
            return response()->json([
                'message' => 'Acceso no autorizado. Se requieren permisos de Administrador de TI.'
            ], 403);
        }

        return $next($request);
    }
}