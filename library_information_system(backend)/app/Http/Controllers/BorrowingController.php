<?php

namespace App\Http\Controllers;

use App\Models\Activity_Staff;
use App\Models\Borrowing;
use Illuminate\Http\Request;
use App\Models\Book;
use App\Models\Student;

class BorrowingController extends Controller
{
    // Menampilkan semua peminjaman

    public function index()
    {
        $borrowings = Borrowing::all();

        if ($borrowings->isEmpty()) {
            return response()->json([
                'message' => 'Belum ada data peminjaman',
                'data' => []
            ], 200);
        }

        foreach ($borrowings as $borrowing) {
            if ($borrowing->status == 'dipinjam' && $borrowing->tanggal_pengembalian < now()) {
                $borrowing->update([
                    'status' => 'telat'
                ]);
            }
        }

        return response()->json([
            'message' => 'Berhasil menampilkan data peminjaman',
            'data' => $borrowings
        ], 200);
    }

    // Menambahkan peminjaman baru
    public function store(Request $request)
    {
        $user = auth()->user();

        // Validasi request
        $request->validate([
            'kode_buku' => 'required|string|exists:books,kode_buku',
            'tanggal_pinjam' => 'required|date',
            'tanggal_pengembalian' => 'required|date|after:tanggal_pinjam',  // Pastikan tanggal pengembalian setelah tanggal pinjam
        ]);

        try {
            
            $existingBorrowingPinjam = Borrowing::where('id_siswa', $user->id_siswa)->where('kode_buku', $request->kode_buku)->where('status', 'dipinjam')->first();
            $existingBorrowingPending = Borrowing::where('id_siswa', $user->id_siswa)->where('kode_buku', $request->kode_buku)->where('status', 'pending')->first();


            if ($existingBorrowingPinjam) {
                # code...
                return response()->json([
                    'message'=> 'Anda Sudah meminjam buku ini, harap kembalikan sebelum meminjam lagi',
                ], 400);
            }

            if ($existingBorrowingPending) {
                # code...
                return response()->json([
                    'message' => 'Anda diharap menunggu peminjaman anda di setujui oleh staff',
                ], 400);
            }
            // Menyimpan peminjaman
            $borrowing = Borrowing::create([
                'id_siswa' => $user->id_siswa,
                'tanggal_pinjam' => $request->tanggal_pinjam,
                'tanggal_pengembalian' => $request->tanggal_pengembalian,
                'status' => 'pending',
                'kode_buku' => $request->kode_buku,
            ]);
                # code...
               return response()->json([
                    'message' => 'Peminjaman Berhasil Diajukan tunggu disetujui oleh staff',
                    'data' => $borrowing
             ],200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Peminjaman gagal ditambahkan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    //Menampilkan Peminjaman untuk siswa sendiri tanpa bisa melihat peminjaman orang lain
    public function showPeminjamanStudent()
    {
        $user = auth()->user();

        $borrowings = Borrowing::where('id_siswa', $user->id_siswa)
            ->with('book')
            ->get();

        if ($borrowings->isEmpty()) {
            return response()->json([
                'message' => 'Tidak ada data peminjaman untuk siswa ini.',
                'data' => []
            ], 200);
        }

        $data = $borrowings->map(function ($borrowing) {
            return [
                'id_peminjaman' => $borrowing->id_peminjaman,
                'tanggal_pinjam' => $borrowing->tanggal_pinjam,
                'tanggal_pengembalian' => $borrowing->tanggal_pengembalian,
                'kode_buku' => $borrowing->kode_buku,
                'status' => $borrowing->status,
                'buku' => $borrowing->book,
            ];
        });

        return response()->json([
            'message' => 'Berhasil menampilkan data peminjaman siswa',
            'data' => $data,
        ], 200);
    }

    // Menampilkan detail peminjaman
    public function show($id_peminjaman, $kode_buku)
    {
        $borrowing = Borrowing::where('id_peminjaman', $id_peminjaman)->where('kode_buku', $kode_buku)->first();

        if (!$borrowing) {
            return response()->json([
                'message' => 'Peminjaman tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'message' => 'Peminjaman ditemukan',
            'data' => $borrowing
        ], 200);
    }

    // Mengupdate peminjaman
    public function update(Request $request, $id_peminjaman, $kode_buku)
    {

        $request->validate([
            'tanggal_pinjam' => 'nullable|date',
            'tanggal_pengembalian' => 'nullable|date',
        ]);

        // Mencari peminjaman berdasarkan ID dan kode buku
        $borrowing = Borrowing::where('id_peminjaman', $id_peminjaman)->where('kode_buku', $kode_buku)->first();

       

        // Jika peminjaman tidak ditemukan
        if (!$borrowing) {
            return response()->json([
                'message' => 'Peminjaman tidak ditemukan'
            ], 404);
        }

        // Mengupdate data peminjaman
        $borrowing->status = $request->status;
        $borrowing->tanggal_pinjam = $request->tanggal_pinjam;
        $borrowing->tanggal_pengembalian = $request->tanggal_pengembalian;

        
        $borrowing->save();

        return response()->json([
            'message' => 'Peminjaman sukses diupdate',
            'data' => $borrowing,
        ], 200);
    }

    // Menghapus peminjaman
    public function destroy($id_peminjaman)
    {
        // Mencari peminjaman berdasarkan ID
        $borrowing = Borrowing::find($id_peminjaman);

        // Jika peminjaman tidak ditemukan
        if (!$borrowing) {
            return response()->json([
                'message' => 'Peminjaman tidak ditemukan'
            ], 404);
        }

        // Menghapus peminjaman
        $borrowing->delete();

        return response()->json([
            'message' => 'Peminjaman berhasil dihapus'
        ], 200);
    }

    // Mencari peminjaman berdasarkan id_siswa
    public function search($id_siswa)
    {
        $borrowings = Borrowing::where('id_siswa', $id_siswa)->get();

        if ($borrowings->isEmpty()) {
            return response()->json([
                'message' => 'Peminjaman tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'message' => 'Peminjaman ditemukan',
            'data' => $borrowings
        ], 200);
    }

    // Menampilkan peminjaman berdasarkan status
    public function filter($status)
    {
        // Validasi status
        $validStatuses = ['dipinjam', 'dikembalikan', 'pending', 'ditolak'];
        if (!in_array($status, $validStatuses)) {
            return response()->json([
                'message' => 'Status tidak valid'
            ], 400);
        }

        $borrowings = Borrowing::where('status', $status)->get();

        if ($borrowings->isEmpty()) {
            return response()->json([
                'message' => 'Peminjaman tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'message' => 'Data ditemukan',
            'data' => $borrowings
        ], 200);
    }

    public function updateStatusPeminjaman(Request $request, $id_peminjaman, $kode_buku){
        $request->validate([
            'status' => 'required|in:dipinjam,pending,dikembalikan,ditolak'
        ]);

        $borrowing = Borrowing::where('id_peminjaman', $id_peminjaman)->where('kode_buku', $kode_buku)->first();
        $nama_peminjam = Student::where('id_siswa', $borrowing->id_siswa)->first();
        $book = Book::where('kode_buku', $borrowing->kode_buku)->first();

        if (!$borrowing) {
            return response()->json([
                'message' => 'Peminjaman tidak ditemukan'
            ], 404);
        }


        if ($request->status == 'dipinjam' && $borrowing->status == 'dipinjam') {
            # code...
            return response()->json([
                'message'=>'Buku ini sudah diset ke dipinjam, tidak bisa diset ke dipinjam lagi kecuali dikembalikan terlebih dahulu.'
            ], 400);
        }

        if ($request->status == 'pending' && $borrowing->status == 'pending') {
            # code...
            return response()->json([
                'message'=>'Buku ini sudah diset ke pending, tidak bisa diset ke pending lagi'
            ], 400);
        }

        if ($request->status == 'dikembalikan' && $borrowing->status == 'dikembalikan') {
            # code...
            return response()->json([
                'message'=>'Buku ini sudah diset ke dikembalikan, tidak bisa diset'
            ], 400);
        }

        if ($request->status == 'ditolak' && $borrowing->status == 'ditolak') {
            # code...
            return response()->json([
                'message'=>'Buku ini sudah diset ke ditolak, tidak bisa diset'
            ], 400);
        }
        

        if ($request->status == 'dikembalikan') {

            $book->increment('stok', 1);
            $borrowing->status = $request->status;
            $borrowing->save();
            return response()->json([
                'message' => 'oke buku sudah dikembalikan',
                'data' => $borrowing,
                'stok'=> $book->stok,
                'Aktivitas'=> Activity_Staff::create([
                    'id_staff' => auth()->user()->id_staff,
                    'id_peminjaman' => $borrowing->id_peminjaman,
                    'aktivitas' => auth()->user()->name . ' menyetujui pengembalian buku dari'
                ])
            ]);
        }

        if ($request->status == 'ditolak') {
            # code...
            $borrowing->status = $request->status;
            $borrowing->save();
            return response()->json([
                'message' => 'status Peminjaman Berhasil ditolak',
                'data' => $borrowing,
                'Aktivitas' => Activity_Staff::create([
                    'id_staff' => auth()->user()->id_staff,
                    'id_siswa' => $borrowing->id_siswa,
                    'aktivitas' => auth()->user()->name .' menolak status peminjaman buku dari '.$nama_peminjam,
                ])
            ]);
        }

        $borrowing->status = $request->status;
        $borrowing->save();
        $book->decrement('stok', 1);
        $book->save();

        return response()->json([
            'message' => 'status Peminjaman Berhasil disetujui sekarang siswa sudah bisa pinjam buku nya',
            'data' => $borrowing,
            'stok' => $book->stok,
            Activity_Staff::create([
                'id_staff' => auth()->user()->id_staff,
                'id_siswa' => $borrowing->id_siswa,
                'aktivitas' => auth()->user()->name .' approve status peminjaman buku dari '.$nama_peminjam
            ])
        ],200);
    }

    public function showPeminjaman($id_siswa){
        $id_user = auth()->user()->id_siswa;
        $borrowings = Borrowing::where('id_siswa', $id_siswa)->get();

        if ($id_user != $id_siswa) {
            # code...
            return response()->json([
                'message' => 'Anda tidak boleh mengakses peminjaman lain'
            ], 404);
        }

        return response()->json([
            'message' => 'Data ditemukan',
            'data' => $borrowings
        ], 200);
    }

    public function filterPeminjaman(Request $request){
        $startDate = $request->query('start_date');
    $endDate = $request->query('end_date');

    $query = Borrowing::query();

    if ($startDate && $endDate) {
        $query->whereBetween('tanggal_pinjam', [$startDate, $endDate]);
    } elseif ($startDate) {
        $query->whereDate('tanggal_pinjam', '>=', $startDate);
    } elseif ($endDate) {
        $query->whereDate('tanggal_pinjam', '<=', $endDate);
    }

    $peminjaman = $query->get();

    return response()->json([
        'message' => 'Data peminjaman berhasil difilter',
        'data' => $peminjaman
    ], 200);
    }
    

    public function beriRating(Request $request, $id_peminjaman)
{
    $user = auth()->user();

    // Validasi input
    $request->validate([
        'rating' => 'required|integer|min:1|max:5',
    ]);

    // Cari data peminjaman
    $borrowing = Borrowing::where('id_peminjaman', $id_peminjaman)
        ->where('id_siswa', $user->id_siswa)
        ->first();

    if (!$borrowing) {
        return response()->json([
            'message' => 'Peminjaman tidak ditemukan',
        ], 404);
    }

    if ($borrowing->status !== 'dikembalikan') {
        return response()->json([
            'message' => 'Rating hanya bisa diberikan setelah buku dikembalikan',
        ], 403);
    }

    // Update rating
    $borrowing->rating = $request->rating;
    $borrowing->save();

    return response()->json([
        'message' => 'Rating berhasil disimpan',
        'data' => $borrowing
    ], 200);
}

}

