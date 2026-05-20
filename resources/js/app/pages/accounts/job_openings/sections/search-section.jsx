import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import React, { useState } from "react";
import { TbSearch } from "react-icons/tb";
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
        <div className="bg-white shadow-xl p-5 border-2 rounded-2xl flex flex-col sm:flex-row gap-2 my-3">
            <div className="flex-1 w-full">
                <form onSubmit={handleSearchSubmit}>
                    <Input
                        iconLeft={<TbSearch className="text-xl" />}
                        label="Search job postings..."
                        name="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>
            </div>
            <div className="w-full sm:w-auto">
                <Select
                    label="All Status"
                    value={status}
                    onChange={handleStatusChange}
                    options={[
                        { value: "all", label: "All Status" },
                        { value: "active", label: "Active" },
                        { value: "closed", label: "Closed" },
                        { value: "draft", label: "Draft" },
                    ]}
                />
            </div>
        </div>
    );
}