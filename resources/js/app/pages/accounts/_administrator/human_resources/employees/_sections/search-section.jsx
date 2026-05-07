

import Input from "@/app/_components/input";
import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";

export default function SearchSection({ onSearch }) {
    // 1. Logic to extract 'search' from the URL query string
    const getInitialSearchValue = () => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            return params.get("search") || "";
        }
        return "";
    };

    const [searchTerm, setSearchTerm] = useState("");

    // 2. Sync state with URL on initial mount
    useEffect(() => {
        setSearchTerm(getInitialSearchValue());
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevents full page reload

        if (onSearch) {
            onSearch(searchTerm);
        }

        // 3. Update the URL via Inertia
        router.get(
            window.location.pathname,
            { search: searchTerm },
            { preserveState: true, replace: true }
        );
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow p-4 rounded-xl flex items-end gap-4 my-3 "
        >
            <div className="flex-1">
                <Input
                    label="Search Employees..."
                    name="search"
                    // 4. Link value and onChange to state for the default value to appear
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter name, ID, or department..."
                />
            </div>
            <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors h-[42px]"
                type="submit"
            >
                Search
            </button>
        </form>
    );
}