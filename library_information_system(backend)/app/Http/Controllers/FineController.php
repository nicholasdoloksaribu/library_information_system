<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Fine;

class FineController extends Controller
{
    //
    public function index(){
        $fines = Fine::all();
        $fines = response()->json($fines);
        return $fines;
    }

    public function store(Request $request){
        $request->validate([
            'kode_buku' => 'required|exists:books,kode_buku',
            'id_peminjaman' => 'required|integer',
            'jumlah_denda' => 'required|integer',
            'status' => 'required|string',
            'tanggal_bayar' => 'nullable|date'
        ]);

        $fine = Fine::create($request->all());
        return response()->json([
            'message' => 'Denda sukses ditambahkan',
            'data' => $fine
        ], 201);
    }

    public function show($id_denda){
        $fine = Fine::where('id_denda', $id_denda)->first();
        if($fine){
            return response()->json($fine);
        }
        return response()->json([
            'message' => 'Denda tidak ditemukan'
        ], 404);
    }

    public function update(Request $request, $id_denda){
        $fine = Fine::findOrFail($id_denda);
        if($fine){
            $fine->update($request->all());
            return response()->json([
                'message' => 'Denda sukses diupdate',
                'data' => $fine
            ], 200);
        }
        return response()->json([
            'message' => 'Denda tidak ditemukan'
        ], 404);
    }

    public function destroy($id_denda){
        $fine = Fine::findOrFail($id_denda);
        if($fine){
            $fine->delete();
            return response()->json([
                'message' => 'Denda sukses dihapus'
            ], 200);
        }
        return response()->json([
            'message' => 'Denda tidak ditemukan'
        ], 404);
    }
}
