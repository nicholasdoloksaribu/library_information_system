<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Staff;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;

class StaffController extends Controller
{
    //
    public function index(){
        $staffs = Staff::all();
        $staffs = response()->json($staffs);
        return $staffs;
    }

    public function register(Request $request){
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|unique:staff,email|string',
            'no_telepon' => 'required|string',
            'foto_profil' => 'nullable|string|image|mimes:jpeg,png,jpg|max:2048',
            'tanggal_daftar' => 'nullable|date',
            'password' => 'required|string|min:6|confirmed',
        ]);
      
        $noTeleponExist = Staff::where('no_telepon', $request->no_telepon)->exists();
        if($noTeleponExist){
            return response()->json([
                'message' => 'No telepon sudah digunakan'
            ],400);
        }

        $emailExistStudent = Student::where('email', $request->email)->exists();
        if($emailExistStudent){
            return response()->json([
                'message' => 'Email sudah digunakan siswa'
            ], 400);
        }

        $emailExistStaff = Staff::where('email', $request->email)->exists();
        if($emailExistStaff){
            return response()->json([
                'message' => 'Email sudah digunakan staff'
            ], 400);
        }


        //cek apakah password sudah digunakan
        $passwordSudahDigunakan = Staff::get()->contains(function($staff) use ($request){
            return Hash::check($request->password, $staff->password);
        });

        if($passwordSudahDigunakan){
            return response()->json([
                'message' => 'Password sudah digunakan silahkan gunakan password lain'
            ], 400);
        }


        if ($request->filled('foto_profil')) {
            $foto_profil = $request->file('foto_profil');
            $fileName = time() . '.' . $foto_profil->getClientOriginalExtension();
            $filePath = $foto_profil->storeAs('uploads/staff/foto_profil', $fileName, 'public');
            # code...
        }else {
            return response()->json([
                'message' => 'Foto profil harus diisi'
            ], 400);
        }

        try {
            //code...
            $staff = new Staff();
            $staff->tanggal_daftar = now();
            $staff->name = $request->name;
            $staff->email = $request->email;
            $staff->no_telepon = $request->no_telepon;
            $staff->foto_profil = $filePath;
            $staff->password = Hash::make($request->password);
            $staff->save();
    
            return response()->json([
                'message' => 'Staff berhasil mendaftar tunggu konfirmasi dari kepala perpustakaan',
                'data' => $staff
            ], 201);
        }
        catch (\Throwable $e) {
            //throw $th;
            return response()->json([
                'message' => 'Staff gagal ditambahkan',
                'data' => $e->getMessage()
            ], 400);

        }


    }

    public function show($id_staff){
        $staff = Staff::where('id_staff', $id_staff)->first();
        if($staff){
            return response()->json($staff);
        }
        return response()->json([
            'message' => 'Staff tidak ditemukan'
        ], 404);
    }

    public function update(Request $request, $id_staff){
        $staff = Staff::findOrFail($id_staff);
    
        $request->validate([
            'name' => 'nullable|string',
            'email' => 'nullable|string|email',
            'no_telepon' => 'nullable|string',
            'foto_profil' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'password' => 'nullable|string',
            'status' => 'nullable|string|in:pending,approved,rejected',
            'hak_akses_CRUD' => 'nullable|boolean',
            'hak_akses_approve' => 'nullable|boolean',
        ]);
    
        // Cek apakah password sudah digunakan oleh staff lain
        if ($request->filled('password')) {
            $passwordSudahDigunakan = Staff::where('id', '!=', $id_staff)->get()->contains(function ($staff) use ($request) {
                return Hash::check($request->password, $staff->password);
            });
    
            if ($passwordSudahDigunakan) {
                return response()->json([
                    'message' => 'Password sudah digunakan, silahkan gunakan password lain'
                ], 400);
            }
        }
    
        // Update data staff jika ada perubahan
        if ($request->filled('name')) $staff->name = $request->name;
        if ($request->filled('email')) $staff->email = $request->email;
        if ($request->filled('no_telepon')) $staff->no_telepon = $request->no_telepon;
        if ($request->filled('foto_profil')) $staff->foto_profil = $request->foto_profil;
        if ($request->filled('password')) $staff->password = bcrypt($request->password);
        if ($request->filled('status')) $staff->status = $request->status;
        if ($request->filled('hak_akses_CRUD')) $staff->hak_akses_CRUD = $request->hak_akses_CRUD;
        if ($request->filled('hak_akses_approve')) $staff->hak_akses_approve = $request->hak_akses_approve;
    
        $staff->save(); // Simpan perubahan ke database
    
        return response()->json([
            'message' => 'Staff sukses diupdate',
            'data' => $staff
        ], 200);
    }
    

    public function destroy($id_staff){
        $staff = Staff::findOrFail($id_staff);
        if($staff){
            $staff->delete();
            return response()->json([
                'message' => 'Staff sukses dihapus'
            ], 200);
        }
        return response()->json([
            'message' => 'Staff tidak ditemukan'
        ], 404);
    }

    function search($name){
        $staff = Staff::where('name', 'like', '%'.$name.'%')
        ->orWhere('email', 'like', '%'.$name.'%')
        ->orWhere('no_telepon', 'like', '%'.$name.'%')->get();
        if($staff){
            return response()->json($staff);
        }
        return response()->json([
            'message' => 'Staff tidak ditemukan'
        ], 404);
    }

    
}
