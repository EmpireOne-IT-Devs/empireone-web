import React from "react";
import { useSelector } from "react-redux";
import { router } from "@inertiajs/react";

export default function HeaderSection() {
    const { data } = useSelector((store) => store.app);
    const locations = data?.locations || [];

    const searchParams =
        typeof window !== "undefined"
            ? new URLSearchParams(window.location.search)
            : null;

    const currentLocationId =
        searchParams?.get("location_id") ||
        (locations[0]?.id ? String(locations[0].id) : "");

    const handleLocationChange = (e) => {
        const selectedLocationId = e.target.value;
        const currentPathname =
            typeof window !== "undefined" ? window.location.pathname : "";

        router.get(
            currentPathname,
            selectedLocationId ? { location_id: selectedLocationId } : {},
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-3">
            <div className="flex flex-col gap-2">
                <div className="text-2xl font-black">Employee Relations</div>
                <div className="text-gray-600">
                    Manage employee concerns, communication, and workplace engagement
                </div>
            </div>

            <div className="w-full sm:w-64">
                <label
                    htmlFor="location_id"
                    className="block text-xs font-medium text-gray-500 mb-1"
                >
                    Location
                </label>
                <select
                    id="location_id"
                    name="location_id"
                    value={currentLocationId}
                    onChange={handleLocationChange}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    {locations.length === 0 && (
                        <option value="">No locations available</option>
                    )}
                    {locations.map((loc) => (
                        <option key={loc.id} value={String(loc.id)}>
                            {loc.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}