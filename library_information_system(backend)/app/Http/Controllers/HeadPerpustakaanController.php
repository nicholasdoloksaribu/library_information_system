<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HeadPerpustakaan;
use Illuminate\Support\Facades\Hash;

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
            'no_telepon' => 'required|string|max:12',
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
}
