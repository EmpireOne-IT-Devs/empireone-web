<?php

namespace App\Http\Controllers;

use App\Http\Resources\LocationEmployeeCountResource;
use App\Models\Account\AccountEmployee;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $locations = Location::get();

        return response()->json($locations, 200);
    }

    public function employeeCounts(Request $request)
    {
        $this->authorizeEmployeeDirectoryAccess($request);

        $counts = AccountEmployee::query()
            ->whereNotNull('employee_id')
            ->whereNotNull('location_id')
            ->whereHas('user', function ($query) {
                $query->whereIn('role', [1, 2]);
            })
            ->selectRaw('location_id, COUNT(*) as employee_count')
            ->groupBy('location_id')
            ->pluck('employee_count', 'location_id');

        $locations = Location::query()
            ->orderBy('name')
            ->get()
            ->each(function ($location) use ($counts) {
                $location->setAttribute('employee_count', (int) ($counts[$location->id] ?? 0));
            });

        return LocationEmployeeCountResource::collection($locations);
    }

    public function exportEmployees(Request $request, Location $location)
    {
        $this->authorizeEmployeeDirectoryAccess($request);

        $employees = AccountEmployee::query()
            ->with([
                'user',
                'personal_information',
                'department',
                'site',
            ])
            ->where('location_id', $location->id)
            ->whereNotNull('employee_id')
            ->whereHas('user', function ($query) {
                $query->whereIn('role', [1, 2]);
            })
            ->orderBy('id');

        $filename = sprintf(
            'employees-%s-%s.csv',
            Str::slug($location->name) ?: 'location',
            now()->format('Y-m-d')
        );

        return response()->streamDownload(function () use ($employees) {
            $output = fopen('php://output', 'w');
            fputcsv($output, [
                'Employee ID',
                'Name',
                'Work Email',
                'Department',
                'Site',
                'Employment Status',
                'Start Date',
            ]);

            $employees->chunkById(500, function ($batch) use ($output) {
                foreach ($batch as $employee) {
                    $personalInformation = $employee->personal_information;
                    $name = $personalInformation
                        ? trim(implode(' ', array_filter([
                            $personalInformation->first_name,
                            $personalInformation->middle_name,
                            $personalInformation->last_name,
                            $personalInformation->suffix,
                        ])))
                        : ($employee->user?->name ?? '');

                    fputcsv($output, array_map(
                        fn ($value) => $this->spreadsheetSafeValue($value),
                        [
                            $employee->employee_id,
                            $name,
                            $employee->user?->email,
                            $employee->department?->name,
                            $employee->site?->name,
                            $employee->employment_status,
                            $employee->started_at,
                        ]
                    ));
                }
            });

            fclose($output);
        }, $filename, ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    private function authorizeEmployeeDirectoryAccess(Request $request): void
    {
        $user = $request->user();
        abort_unless(
            $user !== null
                && in_array($user->role, [1, 2], true)
                && $user->account_employee()->exists(),
            403
        );
    }

    private function spreadsheetSafeValue(mixed $value): string
    {
        $value = (string) ($value ?? '');

        if (preg_match('/^[\s\x00-\x1F]*[=+\-@]/u', $value) === 1) {
            return "'".$value;
        }

        return $value;
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Location $location)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Location $location)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Location $location)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Location $location)
    {
        //
    }
}
