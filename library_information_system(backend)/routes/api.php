<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    BookController,
    StaffController,
    ActivityStaffController,
    StudentController,
    BorrowingController,
    FineController,
    RatingController,
    AuthController,
    HeadPerpustakaanController
};
use App\Models\Student;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 🟢 **Route untuk Login & Register**
Route::post('/loginStudent', [AuthController::class, 'loginStudent']);
Route::post('/students', [StudentController::class, 'register']);

// Route::get('/books', [BookController::class, 'index']);
  // 🌟 **Rating Buku**
  Route::get('/ratings', [RatingController::class, 'index']);
  Route::post('/ratings', [RatingController::class, 'store']);



Route::post('/staff', [StaffController::class, 'register']);
Route::post('/loginStaff', [AuthController::class, 'loginStaff']);


Route::post('/loginHeadPerpustakaan', [AuthController::class, 'loginHeadPerpustakaan']);
Route::post('/headPerpustakaan', [HeadPerpustakaanController::class, 'store']);





// 🟢 **Route untuk Aktivitas Staff (Public Access)**
Route::get('/activity_staffs', [ActivityStaffController::class, 'index']);
Route::get('/activity_staffs/search/{aktivitas}', [ActivityStaffController::class, 'search']);

// 🟢 **Route yang hanya bisa diakses oleh Student**
Route::middleware(['auth:sanctum', 'abilities:student'])->prefix('students')->group(function () {
    
    // 📚 **Buku**
    Route::get('/books', [BookController::class, 'index']);
    Route::get('/books/{kode_buku}', [BookController::class, 'show']);
    Route::get('/books/search/{judul}', [BookController::class, 'search']);
    Route::get('/books/filter/{kategori}', [BookController::class, 'filter']);

    // 📘 **Profil Student**
    Route::get('/{id_siswa}', [StudentController::class, 'show']);
    Route::put('/{id_siswa}', [StudentController::class, 'update']);


    // 📌 **Peminjaman (Student hanya bisa melihat peminjamannya sendiri & meminjam buku)**
    Route::get('/borrowings/{id_siswa}', [BorrowingController::class, 'showPeminjaman']);
    Route::post('/borrowings', [BorrowingController::class, 'store']);

    // 🌟 **Rating Buku**
    Route::get('/ratings', [RatingController::class, 'index']);
    Route::post('/ratings', [RatingController::class, 'store']);
    Route::put('/ratings/{kode_buku}', [StudentController::class, 'updateRatings']);

    // 🚪 **Logout Student**
    Route::post('/logoutStudent', [AuthController::class, 'logoutStudent']);
});

// 🟢 **Route yang hanya bisa diakses oleh Staff**
Route::middleware(['auth:sanctum', 'abilities:staff', 'staff.access:crud_books'])->prefix('staff')->group(function () {

    // 📘 **Staff Management**
    Route::get('/staffs/{id_staff}', [StaffController::class, 'show']);
    Route::put('/staffs/{id_staff}', [StaffController::class, 'update']);
   

    // 📚 **Manajemen Buku**
    Route::get('/books', [BookController::class, 'index']);
    Route::post('/books', [BookController::class, 'store']);
    Route::put('/books/{kode_buku}', [BookController::class, 'update']);
    Route::delete('/books/{kode_buku}', [BookController::class, 'destroy']);
    Route::get('/books/search/{judul}', [BookController::class, 'search']);
    
    // 🚪 **Logout Staff**
    Route::post('/logoutStaff', [AuthController::class, 'logoutStaff']);
});

Route::middleware(['auth:sanctum', 'abilities:staff', 'staff.access:approve'])->prefix('staff')->group(function () {
        
    // 🎓 **Manajemen Siswa**
    Route::get('/students', [StudentController::class, 'index']);
    Route::delete('/students/{id_siswa}', [StudentController::class, 'destroy']);
    Route::get('/students/search/{nama}', [StudentController::class, 'search']);

    //update status siswa
    Route::put('/updateStatus/{id_siswa}', [StudentController::class, 'updateStatus']);

    // 📌 **Manajemen Peminjaman**
    Route::get('/borrowings', [BorrowingController::class, 'index']);
    Route::get('/borrowings/{id_siswa}/{kode_buku}', [BorrowingController::class, 'show']);
    Route::put('/borrowings/{id_siswa}/{kode_buku}', [BorrowingController::class, 'update']);
    Route::delete('/borrowings/{id_siswa}/{kode_buku}', [BorrowingController::class, 'destroy']);

    //Filter Peminjaman berdasarkan tanggal
    Route::post('/borrowingsFilter', [BorrowingController::class, 'filterPeminjaman']);

    //Update Status Peminjaman
    Route::put('/updateStatus/{id_peminjaman}/{kode_buku}', [BorrowingController::class, 'updateStatus']);


    // 🚪 **Logout Staff**
    Route::post('/logoutStaff', [AuthController::class, 'logoutStaff']);
});


// 🟢 **Route yang hanya bisa diakses oleh Head Perpustakaan**
Route::middleware(['auth:sanctum', 'abilities:headperpustakaan'])->prefix('headperpustakaan')->group(function () {
    // 📚 **Manajemen Buku**
    Route::get('/books', [BookController::class, 'index']);
    Route::post('/books', [BookController::class, 'store']);
    Route::put('/books/{kode_buku}', [BookController::class, 'update']);
    Route::delete('/books/{kode_buku}', [BookController::class, 'destroy']);
    Route::get('/books/search/{judul}', [BookController::class, 'search']);

    //Manajemen Student
    Route::get('/students', [StudentController::class, 'index']);
    Route::post('/students', [StudentController::class, 'store']);
    Route::get('/students/{id_siswa}', [StudentController::class, 'show']);
    Route::put('/students/{id_siswa}', [StudentController::class, 'update']);
    Route::delete('/students/{id_siswa}', [StudentController::class, 'destroy']);
    Route::get('/students/search/{nama}', [StudentController::class, 'search']);

    //Manajemen Staff
    Route::get('/staffs', [StaffController::class, 'index']);
    Route::post('/staffs', [StaffController::class, 'store']);
    Route::get('/staffs/{id_staff}', [StaffController::class, 'show']);
    Route::put('/staffs/{id_staff}', [StaffController::class, 'update']);
    Route::delete('/staffs/{id_staff}', [StaffController::class, 'destroy']);
    Route::get('/staffs/search/{nama}', [StaffController::class, 'search']);

    //Manajemen Peminjaman
    Route::get('/borrowings', [BorrowingController::class, 'index']);
    Route::put('/borrowings/{id_siswa}/{kode_buku}', [BorrowingController::class, 'update']);
    Route::delete('/borrowings/{id_siswa}/{kode_buku}', [BorrowingController::class, 'destroy']);

    //Manajemen Buku
    Route::get('/books', [BookController::class, 'index']);
    Route::post('/books', [BookController::class, 'store']);
    Route::get('/books/{kode_buku}', [BookController::class, 'show']);
    Route::put('/books/{kode_buku}', [BookController::class, 'update']);
    Route::delete('/books/{kode_buku}', [BookController::class, 'destroy']);
    Route::get('/books/search/{judul}', [BookController::class, 'search']);
    Route::get('/books/filter/{kategori}', [BookController::class, 'filter']);
    

    // 🚪 **Logout Head Perpustakaan**
    Route::post('/logoutHeadPerpustakaan', [AuthController::class, 'logoutHeadPerpustakaan']);
});

// Route::middleware('auth:sanctum', 'staff.access:crud_books')->group( function () {

//     Route::get('/books', [BookController::class, 'index']);

// });

// Route Aktivitas Staff (Khusus Staff yang Login)
// Route::middleware(['auth:sanctum', 'ability:staff'])->group(function () {
//     Route::post('/activity_staffs', [ActivityStaffController::class, 'store']);
//     Route::get('/activity_staffs/{id_staff}/{kode_buku}', [ActivityStaffController::class, 'show']);
//     Route::put('/activity_staffs/{id_staff}/{kode_buku}', [ActivityStaffController::class, 'update']);
//     Route::delete('/activity_staffs/{id_staff}/{kode_buku}', [ActivityStaffController::class, 'destroy']);
// });