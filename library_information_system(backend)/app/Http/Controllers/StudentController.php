<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Hash;
use App\Models\Staff;

class StudentController extends Controller
{
    //
    public function index()
    {
        $students = Student::all();
        $students = response()->json($students);
        return $students;
    }

    public function show($id_siswa)
    {
    $student = Student::where('id_siswa', $id_siswa)->first();

    if (!$student) {
        return response()->json([
            'message' => 'Siswa tidak ditemukan'
        ], 404);
    }

    return response()->json($student);
   }


    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:students,email',
            'no_telepon' => 'required|string|min:10|max:13|unique:students,no_telepon|regex:/^([0-9\s\-\+\(\)]*)$/',
            'foto_profil' => 'nullable|string',
            'tanggal_daftar' => 'nullable|date',
            'password' => 'required|string|min:6|confirmed',
            'status' => 'nullable|string|in:pending,approved,rejected'
        ]);

        //cek apakah no telepon sudah digunakan
        $noTeleponExist = Student::where('no_telepon', $request->no_telepon)->exists();
        if($noTeleponExist){
            return response()->json([
                'message' => 'No telepon sudah digunakan'
            ],400);
        }

        //cek apakah email sudah digunakan
        $emailExistStudent = Student::where('email', $request->email)->exists();
        $emailExistStaff = Staff::where('email',$request->email)->exists();
        if($emailExistStudent || $emailExistStaff){
            return response()->json([
                'message' => 'Email sudah digunakan'
            ], 400);
        }


        //cek apakah password sudah digunakan
        $passwordSudahDigunakan = Student::get()->contains(function ($student) use ($request) {
            return Hash::check($request->password, $student->password);
        });


        if ($passwordSudahDigunakan) {
            return response()->json([
                'message' => 'Password sudah digunakan silahkan gunakan password lain'
            ], 400);
        }
        try {
            $student = new Student();
            $student->name = $request->name;
            $student->email = $request->email;
            $student->no_telepon = $request->no_telepon;
            $student->foto_profil = $request->foto_profil;
            $student->tanggal_daftar = now();
            $student->password = Hash::make($request->password);
            $student->status = $request->status ?? 'pending'; // default pending
            $student->save();
    
            return response()->json([
                'message' => 'Siswa sukses ditambahkan',
                'data' => $student
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Siswa gagal ditambahkan',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    

    public function update(Request $request, $id_siswa)
{
    try {
        $student = Student::findOrFail($id_siswa);

        $validatedData = $request->validate([
            'name' => 'nullable|string',
            'email' => 'nullable|email|unique:students,email',
            'no_telepon' => 'nullable|string|min:10|max:13|regex:/^([0-9\s\-\+\(\)]*)$/',
            'foto_profil' => 'nullable|string',
            'password' => 'nullable|string|min:6',
            'status' => 'nullable|string|in:pending,approved,rejected'
        ]);


        //cek apakah password sudah digunakan
        if($request->filled('password')){
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
        $student->update($validatedData);
        $student->name = $request->name ?? $student->name;
        $student->email = $request->email ?? $student->email;
        $student->no_telepon = $request->no_telepon ?? $student->no_telepon;
        $student->foto_profil = $request->foto_profil ?? $student->foto_profil;
        $student->status = $request->status ?? $student->status;
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


public function destroy($id_siswa)
{
    try {
        $student = Student::findOrFail($id_siswa);
        $student->delete();

        return response()->json([
            'message' => 'Data Siswa sukses dihapus'
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
