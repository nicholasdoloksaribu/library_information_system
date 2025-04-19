<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Rating;
use Illuminate\Support\Facades\DB;

class RatingController extends Controller
{
    public function index()
    {
        return response()->json(Rating::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'kode_buku' => 'required|string',
            'id_siswa' => 'required|integer',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        // Cek apakah kode_buku dan id_siswa ada di database
        $bookExist = DB::table('books')->where('kode_buku', $request->kode_buku)->exists();
        $siswaExist = DB::table('students')->where('id_siswa', $request->id_siswa)->exists();

        // Jika salah satu tidak ditemukan, kembalikan 422
        if (!$bookExist) {
            return response()->json([
                'message' => 'Kode Buku tidak ditemukan',
                'errors' => ['kode_buku' => ['The selected kode_buku is invalid.']]
            ], 422);
        }

        if (!$siswaExist) {
            return response()->json([
                'message' => 'ID Siswa tidak ditemukan',
                'errors' => ['id_siswa' => ['The selected id_siswa is invalid.']]
            ], 422);
        }

        if ($request->kode_buku == null) {
            # code...
            return response()->json([
                'message' => 'Kode Buku tidak boleh kosong',
                'errors' => ['kode_buku' => ['The kode_buku field is required.']]
            ], 422);
        }

        try {
            $rating = Rating::create([
                'kode_buku' => $request->kode_buku,
                'id_siswa' => $request->id_siswa,
                'rating' => $request->rating,
            ]);

            return response()->json([
                'message' => 'Rating sukses ditambahkan',
                'data' => $rating
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Rating gagal ditambahkan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $rating = Rating::find($id);

        if (!$rating) {
            return response()->json(['message' => 'Rating not found'], 404);
        }

        $rating->update($request->all());

        return response()->json(['message' => 'Rating updated successfully', 'data' => $rating]);
    }
}
