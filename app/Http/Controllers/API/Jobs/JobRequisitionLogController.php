<?php
namespace App\Http\Controllers\API\Jobs;
use App\Http\Controllers\Controller;

use App\Models\Jobs\JobRequisitionLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JobRequisitionLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        JobRequisitionLog::create([
            'job_requisitions_id' => $request->id,
            'user_id' => $user->id,
            'notes' => $request->notes,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(JobRequisitionLog $jobRequisitionLog)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(JobRequisitionLog $jobRequisitionLog)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobRequisitionLog $jobRequisitionLog)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobRequisitionLog $jobRequisitionLog)
    {
        //
    }
}
