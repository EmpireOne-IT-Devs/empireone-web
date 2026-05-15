<?php

namespace App\Http\Controllers\API\ER;

use App\Http\Controllers\Controller;
use App\Mail\ChangeFormEmail;
use App\Models\ER\EREmployeeChangeForm;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EREmployeeChangeFormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ecfs = EREmployeeChangeForm::with(['employee'])->paginate();
        return response()->json($ecfs);
    }

    public function accept_employee_change_form(Request $request)
    {
       
        $ecf = EREmployeeChangeForm::where('id', $request->employee_change_form_id)->first();
         if ($request->info_position_level_to != $ecf->info_position_level_from) {
            # code...
        }
          if ($request->info_department_id_to != $ecf->info_department_id_from) {
            # code...
        }
          if ($request->info_department_id_to != $ecf->info_department_id_from) {
            # code...
        }
        // if ($ecf) {
        //     $ecf->update([
        //         'status' => 'Accepted'
        //     ]);
        // }
        return response()->json([
            'status' => 'success',
        ], 200);
    }
    public function store(Request $request)
    {
        $ecf = EREmployeeChangeForm::create($request->all());
        $user = User::where('id', $request->user_id)->with(['account_employee'])->first();
        $url = url("/accounts/my_documents/$ecf/employee_change_form");
        Mail::to($user->account_employee['eogs_email'])->send(new ChangeFormEmail($user, $url));
        return response()->json([
            'status' => 'success',
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $ecf = EREmployeeChangeForm::where('id', $id)->with(['employee', 'account_to', 'department_to', 'prepaired_by', 'tiering'])->first();
        return response()->json([
            'data' => $ecf,
            'status' => 'success',
        ], 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EREmployeeChangeForm $eREmployeeChangeForm)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EREmployeeChangeForm $eREmployeeChangeForm)
    {
        //
    }
}
