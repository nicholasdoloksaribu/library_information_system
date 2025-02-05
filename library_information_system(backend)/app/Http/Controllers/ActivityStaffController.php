<?php

namespace App\Http\Controllers;

use App\Models\Activity_Staff;

use Illuminate\Http\Request;

class ActivityStaffController extends Controller
{
    //
    function index(){
        $activityStaff = Activity_Staff::all();
        if($activityStaff){
            return response()->json([
            'message' => 'Berhasil menampilkan Aktivitas Staff',
            'data' => $activityStaff
            ],200);
        }
        return response()->json([
            'message' => 'Aktivitas Staff tidak ditemukan'
        ], 404);
    }

    function store(Request $request){
        $request->validate([
            'id_staff' => 'required|exists:staff,id_staff',
            'kode_buku' => 'required|exists:books,kode_buku',
            'aktivitas' => 'required|string',
        ]);

        $activityStaff = Activity_Staff::create($request->all());
        return response()->json([
            'message' => 'Aktivitas Staff sukses ditambahkan',
            'data' => $activityStaff
        ], 201);
    }
    
    public function show($id_staff, $kode_buku){
        $activityStaff = Activity_Staff::where('id_staff', $id_staff)->where('kode_buku', $kode_buku)->first();
        if($activityStaff){
            return response()->json([
            'message' => 'Aktivitas Staff ditemukan',
            'data' => $activityStaff
        ], 200);
        }
        return response()->json([
            'message' => 'Aktivitas Staff tidak ditemukan'
        ], 404);
    }

    public function update(Request $request, $id_staff, $kode_buku){
        $activityStaff = Activity_Staff::where('id_staff', $id_staff)->where('kode_buku', $kode_buku)->first();
        if($activityStaff){
            $activityStaff->update($request->all());
            return response()->json([
                'message' => 'Aktivitas Staff sukses diupdate',
                'data' => $activityStaff
            ], 200);
        }
        return response()->json([
            'message' => 'Aktivitas Staff tidak ditemukan'
        ], 404);
    }

    public function destroy($id_staff, $kode_buku){
        $activityStaff = Activity_Staff::where('id_staff', $id_staff)->where('kode_buku', $kode_buku)->first();
        if($activityStaff){
            $activityStaff->delete();
            return response()->json([
                'message' => 'Aktivitas Staff sukses dihapus'
            ], 200);
        }
        return response()->json([
            'message' => 'Aktivitas Staff tidak ditemukan'
        ], 404);
    }

    public function search($aktivitas){
        $activityStaff = Activity_Staff::where('aktivitas', 'like', '%'.$aktivitas.'%')->get();
        if($activityStaff){
            return response()->json([
            'message' => 'Aktivitas Staff ditemukan',
            'data' => $activityStaff
        ], 200);
        }
        return response()->json([
            'message' => 'Aktivitas Staff tidak ditemukan'
        ], 404);
    }
    
}
