import React from "react";
import { useSelector } from "react-redux";

export default function StatsSection() {
    const { user } = useSelector((store) => store.app);

    // These are arrays of objects
    const approved =
        user?.documents?.filter((res) => res.status == "Approved") || [];
    const pending =
        user?.documents?.filter((res) => res.status == "Pending") || [];
    const declined =
        user?.documents?.filter((res) => res.status == "Declined") || [];
    const re_uploaded =
        user?.documents?.filter((res) => res.status == "Re-Uploaded") || [];

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-4 mb-6">
                {/* Use .length to show the number, not the whole array */}
                <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg font-medium text-blue-700 shadow-sm">
                    Total: {user?.documents?.length ?? 0}
                </div>
                <div className="bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-lg font-medium text-yellow-700 shadow-sm">
                    Pending: {pending.length}
                </div>
                <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-lg font-medium text-green-700 shadow-sm">
                    Approved: {approved.length}
                </div>
                <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-lg font-medium text-red-700 shadow-sm">
                    Declined: {declined.length}
                </div>
                <div className="bg-purple-50 border border-purple-200 px-4 py-2 rounded-lg font-medium text-purple-700 shadow-sm">
                    Re-Uploaded: {re_uploaded.length}
                </div>
            </div>
        </div>
    );
}
