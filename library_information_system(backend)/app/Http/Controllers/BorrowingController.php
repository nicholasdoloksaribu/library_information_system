<?php

namespace App\Http\Controllers;
use App\Models\Borrowing;
use Illuminate\Http\Request;

class BorrowingController extends Controller
{
    //
    public function index(){
        $borrowings = Borrowing::all();
        if($borrowings){
            return response()->json([
                'message' => 'Berhasil menampilkan data',
                'data' => $borrowings
            ],200);
        }
       return response()->json([
        'message' => 'Data tidak ditemukan',
       ],400);
    }

    public function store(Request $request){
        $request->validate([
            'id_siswa' => 'required|integer',
            'id_buku' => 'required|integer',
            'tanggal_pinjam' => 'required|date',
            'tanggal_kembali' => 'required|date',
            'status' => 'required|string',
            'kode_buku' => 'required|exists:books,kode_buku'
        ]);

        $borrowing = Borrowing::create($request->all());
        return response()->json([
            'message' => 'Peminjaman sukses ditambahkan',
            'data' => $borrowing
        ], 201);
    }

    public function show($id_peminjaman){
        $borrowing = Borrowing::where('id_peminjaman', $id_peminjaman)->first();
        if($borrowing){
            return response()->json([
            'message' => 'Peminjaman ditemukan',
            'data' => $borrowing
        ], 200);
        }
        return response()->json([
            'message' => 'Peminjaman tidak ditemukan'
        ], 404);
    }

    public function update(Request $request, $id_peminjaman){
        $borrowing = Borrowing::findOrFail($id_peminjaman);
        if($borrowing){
            $borrowing->update($request->all());
            return response()->json([
                'message' => 'Peminjaman sukses diupdate',
                'data' => $borrowing
            ], 200);
        }
        return response()->json([
            'message' => 'Peminjaman tidak ditemukan'
        ], 404);
    }


    public function destroy($id_peminjaman){
        $borrowing = Borrowing::findOrFail($id_peminjaman);
        if($borrowing){
            $borrowing->delete();
            return response()->json([
                'message' => 'Peminjaman berhasil dihapus'
            ], 200);
        }
        return response()->json([
            'message' => 'Peminjaman tidak ditemukan'
        ], 404);
    }

    public function search($id_siswa){
        $borrowings = Borrowing::where('id_siswa', $id_siswa)->get();
        if($borrowings){
            return response()->json([
                'message' => 'Peminjaman ditemukan',
                'data' => $borrowings
            ],200);
        }
        return response()->json([
            'message' => 'Peminjaman tidak ditemukan'
        ], 404);
    }

    public function filter($status){
        $borrowings = Borrowing::where('status', $status)->get();
        if($borrowings){
            return response()->json($borrowings);
        }
        return response()->json([
            'message' => 'Peminjaman tidak ditemukan'
        ], 404);
    }
    
}
