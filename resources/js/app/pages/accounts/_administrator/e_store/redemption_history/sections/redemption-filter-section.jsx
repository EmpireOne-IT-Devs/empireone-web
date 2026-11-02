import React from "react";

const STATUS_FILTERS = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Processing", value: "processing" },
    { label: "Completed", value: "completed" },
    { label: "Rejected", value: "rejected" },
    { label: "Cancelled", value: "cancelled" },
];

export default function RedemptionFilterSection({ status, onStatusChange, search, onSearchChange, showSearch = false }) {
    return (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-1.5">
                {STATUS_FILTERS.map((filter) => (
                    <button
                        key={filter.value}
                        type="button"
                        onClick={() => onStatusChange(filter.value)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                            status === filter.value
                                ? "bg-orange-500 text-white"
                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
            {showSearch && (
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search reference, employee, item…"
                    className="w-full sm:w-64 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none"
                />
            )}
        </div>
    );
}
