<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class jwtMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Ambil token dari cookie
            $token = $request->cookie('a913h9a0dsj');

            if (!$token) {
                return response()->json(['message' => 'Token not found'], 401);
            }

            // Set token secara manual
            JWTAuth::setToken($token);

            // Verifikasi token dan ambil pengguna
            $user = JWTAuth::authenticate();

            return $next($request);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid or expired token'], 401);
        }
    }
}
