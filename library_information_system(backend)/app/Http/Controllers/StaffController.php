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
            'nama' => 'required|string',
            'email' => 'required|unique:staff,email|string',
            'no_telepon' => 'required|string',
            'foto_profil' => 'nullable|string|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
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

        try {
            //code...
            $staff = new Staff();
            $staff->tanggal_daftar = now();
            $staff->nama = $request->nama;
            $staff->email = $request->email;
            $staff->no_telepon = $request->no_telepon;
            $staff->foto_profil = $request->foto_profil;
            $staff->password = Hash::make($request->password);
            $staff->save();
    
            return response()->json([
                'message' => 'Staff sukses ditambahkan',
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
            'name' => 'nullable|required|string',
            'email' => 'nullable|required|string',
            'no_telepon' => 'nullbale|required|string',
            'foto_profil' => 'nullable|string|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'password' => 'nullable|required|string', 
        ]);

        //cek apakah password sudah digunakan 
        $passwordSudahDigunakan = Staff::get()->contains(function ($staff) use ($request) {
            return Hash::check($request->password, $staff->password);
        });
        if ($passwordSudahDigunakan) {
            return response()->json([
                'message' => 'Password sudah digunakan silahkan gunakan password lain'
            ], 400);
        }
        if($staff){
            $staff->update($request->all());
            return response()->json([
                'message' => 'Staff sukses diupdate',
                'data' => $staff
            ], 200);
        }
        return response()->json([
            'message' => 'Staff tidak ditemukan'
        ], 404);
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
