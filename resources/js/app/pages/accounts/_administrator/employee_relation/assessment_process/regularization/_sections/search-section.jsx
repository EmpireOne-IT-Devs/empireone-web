import React from "react";

export default function SearchSection({ searchQuery, setSearchQuery }) {
    return (
        <>
            <div className="mb-4 flex justify-end w-full">
                <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </>
    );
}
