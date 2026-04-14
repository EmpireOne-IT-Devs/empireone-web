import React from "react";

const stages = [
    { label: "New", count: 6 },
    { label: "Reviewing", count: 1 },
    { label: "Shortlisted", count: 1 },
    { label: "Interview", count: 1 },
    { label: "Rejected", count: 1 },
    { label: "Hired", count: 1 },
];

export default function CardSection() {
    return (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full">
            {stages.map(({ label, count, color }) => (
                <div
                    key={label}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm px-2 py-3 flex flex-col items-center gap-1"
                >
                    
                    <div className="font-bold text-base leading-none">{count}</div>
                    <div className="text-gray-400 text-xs">{label}</div>
                </div>
            ))}
        </div>
    );
}