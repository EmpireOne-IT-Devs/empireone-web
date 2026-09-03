import React from "react";

const FILTERS = ["All", "Individual", "Team"];

export default function HeaderSection({
    activeCount = 0,
    joinedCount = 0,
    filter = "All",
    onFilterChange,
}) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">{activeCount}</span>{" "}
                active challenges
                <span className="mx-1.5 text-gray-300">·</span>
                <span className="font-semibold text-gray-700">{joinedCount}</span>{" "}
                joined
            </p>

            <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1">
                {FILTERS.map((option) => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onFilterChange?.(option)}
                        className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                            filter === option
                                ? "bg-gray-900 text-white"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}
