<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Activity_Staff as ActivityStaff;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Borrowing;
use App\Models\Student;

class BookController extends Controller
{
    //
    public function index()
    {
        $books = Book::all();
        $books = response()->json($books);
        return $books;
    }

    public function store(Request $request)
    {
        Log::info('All Data', [$request->all()]);
        $validatedData = request()->validate([
            'kode_buku' => 'required|unique:books,kode_buku|string',
            'judul' => 'required|string',
            'pengarang' => 'required|string',
            'penerbit' => 'required|string',
            'tahun_terbit' => 'required|integer',
            'call_number' => 'required|string',
            'deskripsi' => 'nullable|string',
            'isbn' => 'nullable|string',
            'foto_buku' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
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
        $book->stok = $validatedData['stok'];
        $book->rak = $validatedData['rak'];


        // Jika ada foto buku yang diupload, simpan ke storage dan ambil path-nya
        if ($request->hasFile('foto_buku')) {
            $file = $request->file('foto_buku');
            $fileName = $file->getClientOriginalName();
            $filePath = $file->storeAs('uploads/buku', $fileName, 'public');
            $book->foto_buku = $filePath;
        }
        $book->save();

        // 3. Kirim data ke FastAPI untuk prediksi kategori
        try {
            $response = Http::post('http://127.0.0.1:8002/predict', [
                'judul' => $validatedData['judul'],
                'call_number' => $validatedData['call_number'],
            ]);

            $kategori_diprediksi = $response->json()['kategori'] ?? null;

            // 4. Update kategori buku jika berhasil
            if ($kategori_diprediksi) {
                $book->update(['kategori' => $kategori_diprediksi]);
            }
        } catch (\Exception $e) {
            Log::error('Gagal memanggil FastAPI: ' . $e->getMessage());
        }
        ActivityStaff::create([
            'id_staff' => $request->user()->id_staff,
            'kode_buku' => $book->kode_buku,
            'aktivitas' => $request->user()->name . 'Menambahkan buku berjudul ' . $book->judul,
            'timestamp' => now()
        ]);

        return response()->json([
            'message' => 'Buku sukses ditambahkan',
            'data' => $book
        ], 201);
    }


    public function show($kode_buku)
    {
        // Ambil buku beserta relasi borrowings yang statusnya dikembalikan dan memiliki rating
        $book = Book::with([
            'borrowings' => function ($query) {
                $query->whereNotNull('rating')->where('status', 'dikembalikan');
            }
        ])->where('kode_buku', $kode_buku)->first();

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


    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'judul' => 'required|string|max:255',
                'pengarang' => 'required|string|max:255',
                'penerbit' => 'required|string|max:255',
                'tahun_terbit' => 'required|integer',
                'call_number' => 'required|string|max:255',
                'deskripsi' => 'required|string',
                'isbn' => 'required|string|max:255',
                'foto_buku' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'stok' => 'required|integer',
                'rak' => 'required|string|max:50',
                'kategori' => 'required|string|max:50',
            ]);

            $book = Book::findOrFail($id);
            $book->update($request->all());

            // Handle file upload if exists
            if ($request->hasFile('foto_buku')) {
                $file = $request->file('foto_buku');
                $filePath = $file->store('uploads/buku', 'public');
                $book->foto_buku = $filePath;
            }

            return response()->json(['message' => 'Book updated successfully']);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Log validation errors
            Log::error('Validation errors: ', $e->errors());
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error updating book: ', [$e->getMessage(), $e->getTraceAsString()]);
            return response()->json(['message' => 'Failed to update book'], 500);
        }
    }


    public function destroy($kode_buku)
    {
        $book = Book::where('kode_buku', $kode_buku)->first();
        if ($book) {
            $book->delete();
            return response()->json([
                'message' => 'Buku sukses dihapus'
            ], 200);

            ActivityStaff::create([
                'id_staff' => auth()->user()->id_staff,
                'kode_buku' => $book->kode_buku,
                'aktivitas' => 'Menghapus buku',
                'timestamp' => now()
            ]);
        }
        return response()->json([
            'message' => 'Buku tidak ditemukan'
        ], 404);
    }

    public function search($judul)
    {
        $books = Book::where('judul', 'like', "%$judul%")->get();
        if ($books) {
            return response()->json($books);
        }
        return response()->json([
            'message' => 'Buku tidak ditemukan'
        ], 404);
    }

    public function filter($kategori)
    {
        $books = Book::where('kategori', $kategori)->get();
        if ($books) {
            return response()->json($books);
        }
        return response()->json([
            'message' => 'Buku tidak ditemukan'
        ], 404);
    }

    public function recommendBuku()
    {
        $id_siswa = auth()->user()->id_siswa;
        $siswa = Student::find($id_siswa);
    
        if (!$siswa) {
            return response()->json(['message' => 'Siswa tidak ditemukan'], 404);
        }
    
        // 🔁 Step 1: Selalu latih model dulu sebelum rekomendasi
        try {
            $trainingData = Borrowing::select('id_siswa', 'kode_buku', 'rating')
                ->whereNotNull('rating')
                ->get()
                ->map(function ($item) {
                    return [
                        'user_id' => (string) $item->id_siswa,
                        'book_id' => (string) $item->kode_buku,
                        'rating' => (string) $item->rating,
                    ];
                })
                ->values()
                ->toArray();
    
            $client = new \GuzzleHttp\Client();
            $client->post('http://127.0.0.1:5000/train', [
                'json' => ['data' => $trainingData]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal melakukan pelatihan model',
                'error' => $e->getMessage()
            ], 500);
        }
    
        // 🔄 Step 2: Cek apakah siswa ini sudah pernah meminjam
        $jumlahPeminjaman = Borrowing::where('id_siswa', $id_siswa)->count();
        if ($jumlahPeminjaman === 0) {
            // 🔁 Belum pernah minjam → ambil buku rating tertinggi
            $books = Book::with('borrowings')
                ->get()
                ->map(function ($book) {
                    $ratings = $book->borrowings->pluck('rating')->filter();
                    $avg = $ratings->count() > 0 ? round($ratings->avg(), 2) : 0;
                    return [
                        'kode_buku' => $book->kode_buku,
                        'judul' => $book->judul,
                        'average_rating' => $avg,
                    ];
                })
                ->sortByDesc('average_rating')
                ->where('average_rating', '>', 0)
                ->values()
                ->take(10);
            return response()->json([
                'message' => 'Rekomendasi buku berdasarkan rating tertinggi',
                'recommendations' => $books
            ]);
        }

        // ✅ Sudah pernah minjam → kirim request ke Flask

    
        // ✅ Step 3: Sudah pernah minjam → minta rekomendasi dari Flask
        try {
            $client = new \GuzzleHttp\Client();
            $response = $client->post('http://127.0.0.1:5000/recommend', [
                'json' => [
                    'user_id' => (string) $id_siswa,
                    'top_k' => 5
                ]
            ]);
    
            $recommendations = json_decode($response->getBody(), true);
    
            return response()->json([
                'message' => 'Rekomendasi berdasarkan model Flask',
                'recommendations' => $recommendations['recommendations']
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    'message' => 'Gagal mendapatkan rekomendasi dari model',
                    'error' => $e->getMessage()
                ],
                500
            );
        }
    }
}
