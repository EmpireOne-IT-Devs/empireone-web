import React from "react";

export default function StatsSection() {
    return (
        <div>
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg font-medium text-blue-700 shadow-sm">
                    Total: <span className="text-blue-900">12</span>
                </div>
                <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-lg font-medium text-green-700 shadow-sm">
                    Approved: 8
                </div>
                <div className="bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-lg font-medium text-yellow-700 shadow-sm">
                    Pending: 2
                </div>
                <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-lg font-medium text-red-700 shadow-sm">
                    Declined: 2
                </div>

                <div className="bg-purple-50 border border-purple-200 px-4 py-2 rounded-lg font-medium text-purple-700 shadow-sm">
                    Re-Uploaded: 2
                </div>
            </div>
        </div>
    );
}
