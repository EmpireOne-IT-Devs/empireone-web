import React, { useState } from "react";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import { TbSearch } from "react-icons/tb";
import { router } from "@inertiajs/react";

export default function SearchSection() {
    const params = new URLSearchParams(window.location.search);

    const [search, setSearch] = useState(params.get("search") || "");
    const [status, setStatus] = useState(params.get("status") || "all");

    const applyFilters = (currentSearch, currentStatus) => {
        const queryParams = {};
        if (currentSearch) queryParams.search = currentSearch;
        if (currentStatus && currentStatus !== "all")
            queryParams.status = currentStatus;

        router.get(window.location.pathname, queryParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
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
        <div className="bg-white p-5 border-2 rounded-2xl flex flex-col sm:flex-row gap-2 my-3">
            <div className="flex-1 w-full">
                <form onSubmit={handleSearchSubmit}>
                    <Input
                        iconLeft={<TbSearch className="text-xl" />}
                        label="Search poll id, title..."
                        name="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>
            </div>

            <div className="w-full sm:w-auto">
                <Select
                    label="All Status"
                    name="status"
                    value={status}
                    onChange={handleStatusChange}
                    options={[
                        { value: "all", label: "All Status" },
                        { value: "active", label: "Active" },
                        { value: "closed", label: "Closed" },
                    ]}
                />
            </div>
        </div>
    );
}