<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\ActivityStaffController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\BorrowingController;
use App\Http\Controllers\FineController;
use App\Http\Controllers\RatingController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


//Route Buku
Route::get('/books', [BookController::class, 'index']);
Route::post('/books', [BookController::class, 'store']);
Route::get('/books/{kode_buku}', [BookController::class, 'show']);
Route::put('/books/{kode_buku}', [BookController::class, 'update']);
Route::delete('/books/{kode_buku}', [BookController::class, 'destroy']);
Route::get('/books/search/{judul}', [BookController::class, 'search']);
Route::get('/books/filter/{kategori}', [BookController::class, 'filter']);

//Route Staff
Route::get('/staffs', [StaffController::class, 'index']);
Route::post('/staff', [StaffController::class, 'register']);
Route::get('/staffs/{id_staff}', [StaffController::class, 'show']);
Route::put('/staffs/{id_staff}', [StaffController::class, 'update']);
Route::delete('/staffs/{id_staff}', [StaffController::class, 'destroy']);
Route::get('/staffs/search/{nama}', [StaffController::class, 'search']);


//Route Aktivitas Staff
Route::get('/activity_staffs', [ActivityStaffController::class, 'index']);
Route::post('/activity_staffs', [ActivityStaffController::class, 'store']);
Route::get('/activity_staffs/{id_staff}/{kode_buku}', [ActivityStaffController::class, 'show']);
Route::put('/activity_staffs/{id_staff}/{kode_buku}', [ActivityStaffController::class, 'update']);
Route::delete('/activity_staffs/{id_staff}/{kode_buku}', [ActivityStaffController::class, 'destroy']);
Route::get('/activity_staffs/search/{aktivitas}', [ActivityStaffController::class, 'search']);

//Route Siswa
Route::get('/students', [StudentController::class, 'index']);
Route::post('/students', [StudentController::class, 'register']);
Route::get('/students/{id_siswa}', [StudentController::class, 'show']);
Route::put('/students/{id_siswa}', [StudentController::class, 'update']);
Route::delete('/students/{id_siswa}', [StudentController::class, 'destroy']);
Route::get('/students/search/{nama}', [StudentController::class, 'search']);

//Route Peminjaman
Route::get('/borrowings', [BorrowingController::class, 'index']);
Route::post('/borrowings', [BorrowingController::class, 'store']);
Route::get('/borrowings/{id_siswa}/{kode_buku}', [BorrowingController::class, 'show']);
Route::put('/borrowings/{id_siswa}/{kode_buku}', [BorrowingController::class, 'update']);
Route::delete('/borrowings/{id_siswa}/{kode_buku}', [BorrowingController::class, 'destroy']);

//Route Denda
Route::get('/fines', [FineController::class, 'index']);
Route::post('/fines', [FineController::class, 'store']);
Route::get('/fines/{id_denda}', [FineController::class, 'show']);
Route::put('/fines/{id_denda}', [FineController::class, 'update']);
Route::delete('/fines/{id_denda}', [FineController::class, 'destroy']);

Route::get('/ratings', [RatingController::class, 'index']);
Route::post('/ratings', [RatingController::class, 'store']);


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
