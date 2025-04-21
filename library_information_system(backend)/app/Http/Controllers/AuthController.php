<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Staff;
use Illuminate\Support\Facades\Hash;
use App\Models\HeadPerpustakaan;

class AuthController extends Controller
{
    // Method untuk login siswa
    
    public function loginStudent(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);

        $student = Student::where('email', $request->email)->first();

        if ($student->status == 'pending' || $student->status == 'rejected') {
            # code...
            return response()->json([
                'message' => 'Akses ditolak. Status siswa belum disetujui'
            ],403);
        }

        if (!$student || !Hash::check($request->password, $student->password)) {
            return response()->json([
                'message' => 'Email atau password salah'
            ], 401);
        }


        $token = $student->createToken('token-name', ['student'])->plainTextToken;
        $abilities = $student->tokens()->latest()->first()->abilities; 

        return response()->json([
        'message' => 'Login berhasil',
        'token' => $token,
        'abilities' => $abilities,
        'status' => 'success',
        ], 200);
    }

    // Method untuk logout siswa
    public function logoutStudent(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json([
            'message' => 'Logout berhasil'
        ], 200);
    }

    // Method untuk login staff
    public function loginStaff(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);

        $staff = Staff::where('email', $request->email)->first();

        if (!$staff) {
            return $this->loginHeadperpustakaan($request);
        }

        if ($staff->status == 'pending') {
            return response()->json([
                'message' => 'Akses ditolak. Status staff belum disetujui'
            ], 403);
        }

        if (!Hash::check($request->password, $staff->password)) {
            return response()->json([
                'message' => 'Email atau password salah'
            ], 401);
        }

        $createdToken = $staff->createToken('staff-token', ['staff']);
        $token = $createdToken->plainTextToken;

        $abilities = $createdToken->accessToken->abilities ?? [];

        return response()->json([
            'message' => 'Login berhasil',
            'token' => $token,
            'abilities' => $abilities,
            'staff' => $staff,
            'status' => 'success'
        ], 200);
    }


    // Method untuk logout staff
    public function logoutStaff(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json([
            'message' => 'Logout berhasil'
        ], 200);
    }

    public function loginHeadPerpustakaan(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);

        $headPerpustakaan = HeadPerpustakaan::where('email', $request->email)->first();

        if (!$headPerpustakaan || !Hash::check($request->password, $headPerpustakaan->password)) {
            return response()->json([
                'message' => 'Email atau password salah'
            ], 401);
        }
        
        // Membuat token dan mendapatkan objeknya
        $createdToken = $headPerpustakaan->createToken('headperpustakaan-token', ['headperpustakaan']);
        $token = $createdToken->plainTextToken;

        // Mengambil abilities dari token
        $abilities = $createdToken->accessToken->abilities ?? [];
        return response()->json([
            'message' => 'Login berhasil',
            'token' => $token,
            'abilities' => $abilities, // Menampilkan abilities dari token yang dibuat
            'headperpustakaan' => $headPerpustakaan,
            'status' => 'success'
        ], 200);
    }

    public function logoutHeadPerpustakaan(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json([
            'message' => 'Logout berhasil'
        ], 200);
    }
}
