import { Search } from "lucide-react";
import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function SearchSection() {
    const params = new URLSearchParams(window.location.search);

    // Initialize state directly from the URL
    const [search, setSearch] = useState(params.get("search") || "");
    const [status, setStatus] = useState(params.get("status") || "all");

    // Centralized function to apply all filters at once
    const applyFilters = (currentSearch, currentStatus) => {
        const queryParams = {};

        if (currentSearch) queryParams.search = currentSearch;
        if (currentStatus && currentStatus !== "all")
            queryParams.status = currentStatus;

        // router.get builds the query string and triggers server-side filtering
        router.get(window.location.pathname, queryParams, {
            preserveState: true, // Keeps input focus
            preserveScroll: true, // Prevents jumping to the top of the page
            replace: true, // Replaces current URL instead of spamming the browser history
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters(search, status);
    };

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        applyFilters(search, newStatus);
    };

    return (
        <div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <form onSubmit={handleSearchSubmit}>
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <select
                        className="w-full md:w-auto px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={status}
                        onChange={handleStatusChange}
                    >
                        <option value="all">All Status</option>
                        <option value="Completed">Completed</option>
                        <option value="Approved">Approved</option>
                        <option value="Pending">Pending</option>
                        <option value="Declined">Declined</option>
                        <option value="Re-Uploaded">Re-Uploaded</option>
                        <option value="Signed">Signed</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
