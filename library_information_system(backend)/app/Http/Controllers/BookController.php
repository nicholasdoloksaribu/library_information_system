<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Activity_Staff as ActivityStaff;

use Illuminate\Http\Request;

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
            'deskripsi' => 'nullable|string',
            'foto_buku' => 'nullable|string',
            'stok' => 'required|integer',
            'lantai' => 'required|string',
            'rak' => 'required|string',
            'kategori' => 'required|string'
       ]);

       // Menambahkan data buku ke database
       $book = Book::create($validatedData);

       // Menambahkan activity staff
       ActivityStaff::create([
        'id_staff' => auth()->user()->id_staff,
        'kode_buku' => $book->kode_buku,
        'aktivitas'=> 'Menambahkan buku',
        'timestamp' => now()
       ]);

       return response()->json([
           'message' => 'Buku sukses ditambahkan',
           'data' => $book
       ], 201);
    }

    public function show($kode_buku)
    {
        $book = Book::where('kode_buku', $kode_buku)->first();
        if($book){
            return response()->json($book);
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
