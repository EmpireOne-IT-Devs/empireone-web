import React from "react";
import { useSelector } from "react-redux";
import { router } from "@inertiajs/react";

export default function TATabsSection({ children }) {
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
        <div>
            <div className="mb-4 max-w-xs">
                <label
                    htmlFor="location_id"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                    Location
                </label>
                <select
                    id="location_id"
                    name="location_id"
                    value={currentLocationId}
                    onChange={handleLocationChange}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
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

            {children}
        </div>
    );
}