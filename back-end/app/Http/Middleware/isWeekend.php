<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class isWeekend
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $now = Carbon::now()->dayOfWeek();

        if($now === 6 || $now === 0) {
            return response()->json([
                'status' => 'unsuccessful',
                'message' => 'Hari ini sedang libur'
            ], 403);
        }
        return $next($request);
    }
}
