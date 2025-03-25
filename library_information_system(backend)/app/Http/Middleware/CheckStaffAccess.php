<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckStaffAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $permission): Response
    {

        $staff = auth()->user();
        

        if ($permission == 'crud_books' && !$staff->hak_akses_CRUD) {
            # code...
            return response()->json(['message' => 'Anda tidak memiliki akses mengupload buku'], 403);
        }

        if ($permission == 'approve' && !$staff->hak_akses_approve) {
            # code...
            return response()->json(['message' => 'Anda tidak memiliki akses fitur ini '], 403);  
        }

        return $next($request);
       
    }
}
