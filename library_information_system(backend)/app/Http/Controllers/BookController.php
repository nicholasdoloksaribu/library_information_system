<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Activity_Staff as ActivityStaff;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BookController extends Controller
{
    //
    public function index()
    {
        $books = Book::all();
        $books = response()->json($books);
        return $books;
    }

    public function store (Request $request)
    {
         $validatedData =  request()->validate([
            'kode_buku' => 'required|unique:books,kode_buku|string',
            'judul' => 'required|string',
            'pengarang' => 'required|string',
            'penerbit' => 'required|string',
            'tahun_terbit' => 'required|integer',
            'call_number' => 'required|string',
            'deskripsi' => 'nullable|string',
            'isbn' => 'nullable|string',
            'foto_buku' => 'nullable|string',
            'stok' => 'required|integer',
            'rak' => 'required|string',
            'kategori' => 'nullable|string'
       ]);

       // Menambahkan data buku ke database
         $book = new Book();
         $book->kode_buku = $validatedData['kode_buku'];
            $book->judul = $validatedData['judul'];
            $book->pengarang = $validatedData['pengarang'];
            $book->penerbit = $validatedData['penerbit'];
            $book->tahun_terbit = $validatedData['tahun_terbit'];
            $book->call_number = $validatedData['call_number'];
            $book->deskripsi = $validatedData['deskripsi'];
            $book->isbn = $validatedData['isbn'];
            $book->foto_buku = $validatedData['foto_buku'];
            $book->stok = $validatedData['stok'];
            $book->rak = $validatedData['rak'];
            $book->save();

        // 3. Kirim data ke FastAPI untuk prediksi kategori
    try {
        $response = Http::post('http://127.0.0.1:8001/predict', [
            'judul' => $validatedData['judul'],
            'call_number' => $validatedData['call_number'],
        ]);

        $kategori_diprediksi = $response->json()['kategori'] ?? null;

        // 4. Update kategori buku jika berhasil
        if ($kategori_diprediksi) {
            $book->update(['kategori' => $kategori_diprediksi]);
        }

    } catch (\Exception $e) {
        // Tangani jika FastAPI tidak merespons
        Log::error('Gagal memanggil FastAPI: ' . $e->getMessage());
    }

    //    Menambahkan activity staff
    //    ActivityStaff::create([
    //     'id_staff' => auth()->user()->id_staff,
    //     'kode_buku' => $book->kode_buku,
    //     'aktivitas'=> 'Menambahkan buku',
    //     'timestamp' => now()
    //    ]);

       return response()->json([
           'message' => 'Buku sukses ditambahkan',
           'data' => $book
       ], 201);
    }

    public function show($kode_buku)
{
    // Ambil buku beserta relasi borrowings yang statusnya dikembalikan dan memiliki rating
    $book = Book::with(['borrowings' => function ($query) {
        $query->whereNotNull('rating')->where('status', 'dikembalikan');
    }])->where('kode_buku', $kode_buku)->first();

    if ($book) {
        $totalRating = $book->borrowings->sum('rating');
        $jumlahOrang = $book->borrowings->count();
        $averageRating = $jumlahOrang > 0 ? round($totalRating / $jumlahOrang, 2) : 0;

        return response()->json([
            'Book' => $book,
            'Rata-Rata rating' => $averageRating
        ]);
    }

    return response()->json([
        'message' => 'Buku tidak ditemukan'
    ], 404);
}


    public function update(Request $request, $kode_buku){
        $book = Book::where('kode_buku', $kode_buku)->first();
        
        $request->validate([
            'judul' => 'nullable|required|string',
            'pengarang' => 'nullable|required|string',
            'penerbit' => 'nullable|required|string',
            'tahun_terbit' => 'nullable|required|integer',
            'deskripsi' => 'nullable|string',
            'foto_buku' => 'nullable|string',
            'stok' => 'nullable|required|integer',
            'lantai' => 'nullable|required|string',
            'rak' => 'nullable|required|string',
            'kategori' => 'nullable|required|string'
        ]);

        try {
       
            $book->update($request->all());
            return response()->json([
                'message' => 'Buku sukses diupdate',
                'data' => $book,
                ActivityStaff::create([
                    'id_staff' => auth()->user()->id_staff,
                    'kode_buku' => $book->kode_buku,
                    'aktivitas'=> 'Mengupdate buku',
                    'timestamp' => now()
                ])
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Buku gagal diupdate',
                'error' => $e->getMessage()
            ], 500);
        }
        
        return response()->json([
            'message' => 'Buku tidak ditemukan'
        ], 404);
    }

    public function destroy($kode_buku){
        $book = Book::where('kode_buku', $kode_buku)->first();
        if($book){
            $book->delete();
            return response()->json([
                'message' => 'Buku sukses dihapus'
            ], 200);

            ActivityStaff::create([
                'id_staff' => auth()->user()->id_staff,
                'kode_buku' => $book->kode_buku,
                'aktivitas'=> 'Menghapus buku',
                'timestamp' => now()
            ]);
        }
        return response()->json([
            'message' => 'Buku tidak ditemukan'
        ], 404);
    }

    public function search($judul){
        $books = Book::where('judul', 'like', "%$judul%")->get();
        if($books){
            return response()->json($books);
        }
        return response()->json([
            'message' => 'Buku tidak ditemukan'
        ], 404);
    }

    public function filter($kategori){
        $books = Book::where('kategori', $kategori)->get();
        if($books){
            return response()->json($books);
        }
        return response()->json([
            'message' => 'Buku tidak ditemukan'
        ], 404);
    }
    
    
}
