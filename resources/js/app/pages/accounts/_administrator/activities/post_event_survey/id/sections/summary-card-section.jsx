import React from "react";

export default function SummaryCardSection({
    totalEmployees = 0,
    totalResponses = 0,
    participationRate = 0,
}) {
    return (
        <div>
            <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-center">
                    <p className="text-2xl font-bold text-gray-800">
                        {totalEmployees}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide font-mono">
                        Total Employees
                    </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-center">
                    <p className="text-2xl font-bold text-green-600">
                        {totalResponses}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide font-mono">
                        Responded
                    </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm text-center">
                    <p className="text-2xl font-bold text-blue-600">
                        {participationRate}%
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide font-mono">
                        Participation Rate
                    </p>
                </div>
            </div>
        </div>
    );
}
