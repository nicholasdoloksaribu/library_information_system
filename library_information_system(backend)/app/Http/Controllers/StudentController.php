<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use App\Models\Student;
use Illuminate\Http\Request;
use App\Models\Activity_Staff;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use App\Models\Rating;

class StudentController extends Controller
{
    //
    public function index()
    {
        $students = Student::all();
        $students = response()->json($students);
        return $students;
    }

    public function show()
    {

        $student = auth()->user();
        if (!$student) {
            return response()->json([
                'message' => 'Siswa tidak ditemukan'
            ], 404);
        }

    if ($student instanceof Student && $student->id_siswa != $id_siswa) {
        # code...
        return response()->json([
            'message' => 'anda tidak bisa lihat profil orang lain ya',
        ], 403);
    }

}

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string',
                'email' => 'required|email|unique:students,email',
                'no_telepon' => 'required|string|min:10|max:13|unique:students,no_telepon|regex:/^([0-9\s\-\+\(\)]*)$/',
                'foto_profil' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'tanggal_daftar' => 'nullable|date',
                'password' => 'required|string|min:6|confirmed',
                'status' => 'nullable|string|in:pending,approved,rejected'
            ]);

            //cek apakah no telepon sudah digunakan
            $noTeleponExist = Student::where('no_telepon', $request->no_telepon)->exists();
            $noTeleponExistStaff = Staff::where('no_telepon', $request->no_telepon)->exists();
            if ($noTeleponExist || $noTeleponExistStaff) {
                return response()->json([
                    'message' => 'No telepon sudah digunakan'
                ], 400);
            }

            //cek apakah email sudah digunakan
            $emailExistStudent = Student::where('email', $request->email)->exists();
            $emailExistStaff = Staff::where('email', $request->email)->exists();
            if ($emailExistStudent || $emailExistStaff) {
                return response()->json([
                    'message' => 'Email sudah digunakan'
                ], 400);
            }

            $filePath = null;

            if ($request->hasFile('foto_profil')) {
                $file = $request->file('foto_profil');
                $fileName = $file->getClientOriginalName();
                $filePath = $file->storeAs('uploads/mahasiswa', $fileName, 'public');
            }

            $student = Student::create([
                'name' => $request->name,
                'email' => $request->email,
                'no_telepon' => $request->no_telepon,
                'foto_profil' => $filePath,
                'tanggal_daftar' => now(),
                'password' => Hash::make($request->password),
                'status' => $request->status
            ]);

            return response()->json([
                'message' => 'Registrasi Berhasil',
                'data' => $student
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi Gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Siswa gagal ditambahkan',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string',
                'email' => 'required|email|unique:students,email',
                'no_telepon' => 'required|string|min:10|max:13|unique:students,no_telepon|regex:/^([0-9\s\-\+\(\)]*)$/',
                'foto_profil' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'tanggal_daftar' => 'nullable|date',
                'password' => 'required|string|min:6|confirmed',
                'status' => 'nullable|string|in:pending,approved,rejected'
            ]);

            //cek apakah no telepon sudah digunakan
            $noTeleponExist = Student::where('no_telepon', $request->no_telepon)->exists();
            $noTeleponExistStaff = Staff::where('no_telepon', $request->no_telepon)->exists();
            if ($noTeleponExist || $noTeleponExistStaff) {
                return response()->json([
                    'message' => 'No telepon sudah digunakan'
                ], 400);
            }

            //cek apakah email sudah digunakan
            $emailExistStudent = Student::where('email', $request->email)->exists();
            $emailExistStaff = Staff::where('email', $request->email)->exists();
            if ($emailExistStudent || $emailExistStaff) {
                return response()->json([
                    'message' => 'Email sudah digunakan'
                ], 400);
            }

            $filePath = null;

            if ($request->hasFile('foto_profil')) {
                $file = $request->file('foto_profil');
                $fileName = $file->getClientOriginalName();
                $filePath = $file->storeAs('uploads/mahasiswa', $fileName, 'public');
            }

            $student = Student::create([
                'name' => $request->name,
                'email' => $request->email,
                'no_telepon' => $request->no_telepon,
                'foto_profil' => $filePath,
                'tanggal_daftar' => now(),
                'password' => Hash::make($request->password),
                'status' => 'pending'
            ]);

            return response()->json([
                'message' => 'Registrasi Berhasil',
                'data' => $student
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi Gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Siswa gagal ditambahkan',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function update(Request $request, $id_siswa)
    {
        $student = auth()->user();
        if ($student->id_siswa != $id_siswa) {
            # code...
            return response()->json([
                'message' => 'anda tidak bisa update profil orang lain',
            ], 403);
        }
        try {
            $student = Student::findOrFail($id_siswa);

            $validatedData = $request->validate([
                'name' => 'nullable|string',
                'email' => 'nullable|email|unique:students,email',
                'no_telepon' => 'nullable|string|min:10|max:13|regex:/^([0-9\s\-\+\(\)]*)$/',
                'foto_profil' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'password' => 'nullable|string|min:6',
            ]);




            //cek apakah password sudah digunakan
            if ($request->filled('password')) {
                $passwordSudahDigunakan = Student::get()->contains(function ($student) use ($request) {
                    return Hash::check($request->password, $student->password);
                });

                if ($passwordSudahDigunakan) {
                    return response()->json([
                        'message' => 'Password sudah digunakan silahkan gunakan password lain'
                    ], 400);

                }
                $validatedData['password'] = Hash::make($request->password);
            }

            if ($request->filled('name'))
                $student->name = $request->name;
            if ($request->filled('email'))
                $student->email = $request->email;
            if ($request->filled('no_telepon'))
                $student->no_telepon = $request->no_telepon;
            if ($request->filled('foto_profil'))
                $student->foto_profil = $request->foto_profil;
            if ($request->filled('password'))
                $student->password = bcrypt($request->password);
            if ($request->filled('status'))
                $student->status = $request->status;

            if ($request->hasFile('foto_profil')) {

                //hapus foto lama 
                if ($student->foto_profil && file_exists(storage_path('app/public/' . $student->foto_profil))) {
                    Storage::delete('public/storage/uploads/mahasiswa/' . $student->foto_profil);
                }

                $file = $request->file('foto_profil');
                $fileName = $file->getClientOriginalName();
                $filePath = $file->storeAs('uploads/mahasiswa', $fileName, 'public');
                $validatedData['foto_profil'] = $filePath;
            } else {
                $validatedData['foto_profil'] = $student->foto_profil;
            }

            $student->save();
            return response()->json([
                'message' => 'Data Siswa sukses diupdate',
                'data' => $student
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Data Siswa tidak ditemukan'
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Data Siswa gagal diupdate',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateStatusSiswa(Request $request, $id_siswa)
    {
        // Validasi request
        $request->validate([
            'status' => 'required|string|in:approved,pending,rejected'
        ]);

        // Mencari siswa berdasarkan ID
        $student = Student::findOrFail($id_siswa);

        if ($request->status == 'rejected') {
            $student->status = 'rejected';
            $student->save();
            return response()->json([
                'message' => 'Status siswa berhasil diperbarui',
                'data' => $student,
                'staff_activity' => Activity_Staff::create([
                    'id_staff' => auth()->user()->id_staff,
                    'id_siswa' => $id_siswa,
                    'aktivitas' => auth()->user()->name . ' menolak status siswa ' . $student->name,
                ])
            ], 200);
        }

        if ($request->status == 'approved') {
            $student->status = 'approved';
            $student->save();
            return response()->json([
                'message' => 'Status siswa berhasil diperbarui',
                'data' => $student,
                'staff_activity' => Activity_Staff::create([
                    'id_staff' => auth()->user()->id_staff,
                    'id_siswa' => $id_siswa,
                    'aktivitas' => auth()->user()->name . ' menyetujui status siswa ' . $student->name,
                ])
            ], 200);
        }
    }

    public function destroy($id_siswa)
    {
        try {
            $student = Student::findOrFail($id_siswa);
            $student->delete();

            return response()->json([
                'message' => 'Data Siswa sukses dihapus',

            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Data Siswa tidak ditemukan'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Data Siswa gagal dihapus',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function search($search)
    {
        $students = Student::where('name', 'like', "%$search%")
            ->orWhere('email', 'like', "%$search%")
            ->orWhere('no_telepon', 'like', "%$search%")
            ->get();

        return response()->json($students);
    }

}
