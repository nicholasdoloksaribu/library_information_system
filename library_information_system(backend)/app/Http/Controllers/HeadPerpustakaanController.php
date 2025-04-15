<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HeadPerpustakaan;
use Illuminate\Support\Facades\Hash;
use App\Models\Staff;
use Illuminate\Support\Facades\Storage;

class HeadPerpustakaanController extends Controller
{
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Display a listing of the Head Perpustakaan records.
 *
 * @return \Illuminate\Http\JsonResponse
 */

/*******  e9443bb8-ac38-4254-96c4-96e64bff5c46  *******/
    //
    public function index()
    {
        return response()->json(HeadPerpustakaan::all());
    }

    public function store(Request $request){
        $request->validate([
            'name' => 'required|string|min:5',
            'email'=> 'required|email|unique:headperpustakaan,email',
            'password' => 'required|string|min:6',
            'no_telepon' => 'required|string|min:11',
        ]);

        $headperpustakaan = HeadPerpustakaan::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'no_telepon' => $request->no_telepon,
        ]);

        return response()->json([
            'message' => 'Head Perpustakaan berhasil ditambahkan',
            'data' => $headperpustakaan
        ], 201);
    }

    public function show($id){
        $headperpustakaan = HeadPerpustakaan::find($id);
        try {
            return response()->json($headperpustakaan);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Head Perpustakaan tidak ditemukan'
            ], 404);
        }
    }

    public function update(Request $request, $id){
        $headperpustakaan = HeadPerpustakaan::find($id);
        try {
            $headperpustakaan->update([
                'name' => $request->name,
                'email' => $request->email,
                'no_telepon' => $request->no_telepon,
            ]);
            return response()->json([
                'message' => 'Head Perpustakaan berhasil diperbarui',
                'data' => $headperpustakaan
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Head Perpustakaan tidak ditemukan',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function destroy($id){
        $headperpustakaan = HeadPerpustakaan::find($id);
        try {
            $headperpustakaan->delete();
            return response()->json([
                'message' => 'Head Perpustakaan berhasil dihapus'
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Head Perpustakaan tidak ditemukan',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function updateStatusStaff(Request $request, $id_staff){
        $request->validate([
        'name' => 'nullable|string',
        'email' => 'nullable|string|email',
        'no_telepon' => 'nullable|string|min:10|max:13|regex:/^([0-9\s\-\+\(\)]*)$/',
        'foto_profil' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        'password' => 'nullable|string|min:6',
        'status' => 'nullable|string|in:pending,approved,rejected',
        'hak_akses_CRUD' => 'nullable|boolean',
        'hak_akses_approve' => 'nullable|boolean',
        ]);

        $staff = Staff::findOrFail($id_staff);


        if ($request->filled('password')) {
            $passwordSudahDigunakan = Staff::where('id', '!=', $id_staff)->get()->contains(function ($s) use ($request) {
                return Hash::check($request->password, $s->password);
            });
    
            if ($passwordSudahDigunakan) {
                return response()->json([
                    'message' => 'Password sudah digunakan, silahkan gunakan password lain'
                ], 400);
            }
    
            $staff->password = bcrypt($request->password);
        }


        if ($request->hasFile('foto_profil')) {
            if ($staff->foto_profil && file_exists(storage_path('app/public/' . $staff->foto_profil))) {
                Storage::delete('public/' . $staff->foto_profil);
            }

            $file = $request->file('foto_profil');
            $fileName = $file->getClientOriginalName();
            $file->storeAs('public', $fileName);
            $staff->foto_profil = $fileName;
        }

         // Update semua data yang diizinkan admin
    if ($request->filled('name')) $staff->name = $request->name;
    if ($request->filled('email')) $staff->email = $request->email;
    if ($request->filled('no_telepon')) $staff->no_telepon = $request->no_telepon;
    if ($request->filled('status')) $staff->status = $request->status;
    if ($request->filled('hak_akses_CRUD')) $staff->hak_akses_CRUD = $request->hak_akses_CRUD;
    if ($request->filled('hak_akses_approve')) $staff->hak_akses_approve = $request->hak_akses_approve;

    $staff->save();

    return response()->json([
        'message' => 'Data Staff berhasil diperbarui',
        'data' => $staff
    ], 200);
    }
}
