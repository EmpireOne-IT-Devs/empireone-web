import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download, MapPin, Users } from "lucide-react";
import Button from "@/app/_components/button";
import Skeleton from "@/app/_components/skeleton";
import {
    export_location_employees_thunk,
    get_location_employee_counts_thunk,
} from "@/app/redux/location-employee-thunk";

export default function EmployeeTest() {
    const dispatch = useDispatch();
    const { locations, loading, error, exporting, exportError } = useSelector(
        (state) => state.location_employees,
    );
    const [selectedLocationId, setSelectedLocationId] = useState(null);
    const [downloadMessage, setDownloadMessage] = useState("");

    useEffect(() => {
        dispatch(get_location_employee_counts_thunk());
    }, [dispatch]);

    useEffect(() => {
        if (
            locations.length > 0 &&
            !locations.some((location) => location.id === selectedLocationId)
        ) {
            setSelectedLocationId(locations[0].id);
        }
    }, [locations, selectedLocationId]);

    const totalEmployees = useMemo(
        () => locations.reduce((total, location) => total + location.employee_count, 0),
        [locations],
    );
    const selectedLocation =
        locations.find((location) => location.id === selectedLocationId) ||
        locations[0] ||
        null;

    async function handleExport() {
        if (!selectedLocation) return;

        setDownloadMessage("");
        const result = await dispatch(
            export_location_employees_thunk(selectedLocation.id),
        );
        if (!export_location_employees_thunk.fulfilled.match(result)) return;

        const url = window.URL.createObjectURL(result.payload.blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = result.payload.filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => window.URL.revokeObjectURL(url), 0);
        setDownloadMessage(`Employee CSV downloaded for ${selectedLocation.name}.`);
    }

    return (
        <section
            aria-labelledby="location-employee-counts-title"
            className="mt-6 space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2
                        id="location-employee-counts-title"
                        className="text-lg font-bold text-gray-900"
                    >
                        Employees by location
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        View employee totals and export a CSV for one location.
                    </p>
                </div>
                <div className="flex items-center gap-2 self-start rounded-xl bg-purple-50 px-4 py-3 sm:self-auto">
                    <Users aria-hidden="true" className="h-5 w-5 text-purple-700" />
                    <span className="text-sm text-gray-600">Total employees</span>
                    <strong className="text-lg text-purple-800">{totalEmployees}</strong>
                </div>
            </div>

            {loading ? (
                <div
                    aria-label="Loading location employee counts"
                    aria-busy="true"
                    className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                >
                    {Array.from({ length: 4 }, (_, index) => (
                        <Skeleton key={index} variant="button" className="h-24 w-full" />
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4" role="alert">
                    <p className="text-sm text-red-700">{error}</p>
                    <button
                        type="button"
                        onClick={() => dispatch(get_location_employee_counts_thunk())}
                        className="mt-2 text-sm font-semibold text-red-800 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                        Try again
                    </button>
                </div>
            ) : locations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
                    <MapPin aria-hidden="true" className="mx-auto h-8 w-8 text-gray-400" />
                    <h3 className="mt-3 font-semibold text-gray-800">No locations found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Location employee counts will appear here when locations are available.
                    </p>
                    <button
                        type="button"
                        onClick={() => dispatch(get_location_employee_counts_thunk())}
                        className="mt-4 rounded-md px-3 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                    >
                        Refresh locations
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {locations.map((location) => {
                            const isSelected = location.id === selectedLocation.id;

                            return (
                                <button
                                    key={location.id}
                                    type="button"
                                    aria-pressed={isSelected}
                                    onClick={() => {
                                        setSelectedLocationId(location.id);
                                        setDownloadMessage("");
                                    }}
                                    className={`rounded-xl border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 ${
                                        isSelected
                                            ? "border-purple-600 bg-purple-50 ring-1 ring-purple-600"
                                            : "border-gray-200 bg-white hover:border-purple-300 hover:bg-gray-50"
                                    }`}
                                >
                                    <span className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                        <MapPin aria-hidden="true" className="h-4 w-4 text-purple-600" />
                                        {location.name}
                                    </span>
                                    <span className="mt-3 block text-2xl font-bold text-gray-900">
                                        {location.employee_count}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {location.employee_count === 1 ? "employee" : "employees"}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-500">
                            Export includes work contact and job details only for the selected location.
                        </p>
                        <Button
                            onClick={handleExport}
                            loading={exporting}
                            disabled={!selectedLocation}
                            className="shrink-0"
                        >
                            <Download aria-hidden="true" className="mr-2 h-4 w-4" />
                            Export {selectedLocation?.name || "employees"} CSV
                        </Button>
                    </div>
                    {exportError && (
                        <p className="text-sm text-red-600" role="alert">
                            {exportError}
                        </p>
                    )}
                    {downloadMessage && (
                        <p className="text-sm text-green-700" role="status">
                            {downloadMessage}
                        </p>
                    )}
                </>
            )}
        </section>
    );
}
