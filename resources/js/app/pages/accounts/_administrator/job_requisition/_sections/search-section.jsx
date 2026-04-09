import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import React, { useState } from "react";
import { TbSearch } from "react-icons/tb";
import CreateJobRequisition from "./create-requisition-section";
import { router } from "@inertiajs/react";

export default function SearchSection() {
    const params = new URLSearchParams(window.location.search);

    // Initialize state directly from the URL. This removes the need for the empty useEffect.
    const [search, setSearch] = useState(params.get("search") || "");
    const [status, setStatus] = useState(params.get("status") || "all_status");

    // Centralized function to apply all filters at once
    const applyFilters = (currentSearch, currentStatus) => {
        const queryParams = {};

        if (currentSearch) queryParams.search = currentSearch;
        if (currentStatus && currentStatus !== "all_status")
            queryParams.status = currentStatus;

        // router.get builds the query string for you and is specifically meant for data fetching
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
        <div className="bg-white shadow-sm p-4 sm:p-5 border-2 rounded-2xl flex flex-col md:flex-row gap-3 my-3">
            <div className="flex-1 w-full">
                <form onSubmit={handleSearchSubmit}>
                    <Input
                        iconLeft={<TbSearch className="text-xl" />}
                        label="Search by position, requisition #..."
                        name="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>
            </div>

            <div className="w-full md:w-48 shrink-0">
                <Select
                    label="All Status"
                    value={status}
                    onChange={handleStatusChange}
                    options={[
                        { value: "all_status", label: "All Status" },
                        { value: "pending", label: "Pending" },
                        { value: "under_review", label: "Under Review" },
                        { value: "approved", label: "Approved" },
                        { value: "rejected", label: "Rejected" },
                        {
                            value: "partially_filled",
                            label: "Partially Filled",
                        },
                        { value: "filled", label: "Filled" },
                    ]}
                />
            </div>

            <div className="w-full md:w-auto shrink-0">
                <CreateJobRequisition />
            </div>
        </div>
    );
}
