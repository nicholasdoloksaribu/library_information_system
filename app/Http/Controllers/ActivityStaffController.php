<?php

namespace App\Http\Controllers;

use App\Models\Activity_Staff;

use Illuminate\Http\Request;

class ActivityStaffController extends Controller
{
    //
    function index(){
        $activityStaff = Activity_Staff::all();
        
    }
    
}
