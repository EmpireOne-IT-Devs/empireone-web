<?php

namespace App\Http\Controllers\API\ER;

use App\Http\Controllers\Controller;
use App\Models\ER\EREmployeeChangeForm;
use Illuminate\Http\Request;

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

    public function store(Request $request)
    {
        $ecf = EREmployeeChangeForm::create($request->all());
        return response()->json([
            'status' => 'success',
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $ecf = EREmployeeChangeForm::where('id', $id)->with(['employee','account_to','department_to','prepaired_by','tiering'])->first();
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
