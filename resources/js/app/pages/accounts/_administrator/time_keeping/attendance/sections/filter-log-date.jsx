import React from "react";

export default function FilterLogDate({ startDate, endDate, onStartDateChange, onEndDateChange }) {
    return (
        <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-gray-500">
                <b>Cutoff Date:</b>
            </span>

            <div className="flex items-center gap-2">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                />

                <span className="text-sm text-gray-500">-</span>

                <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                />
            </div>
        </div>
    );
}
