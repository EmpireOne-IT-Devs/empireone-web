import React from "react";
import { useSelector } from "react-redux";

export default function StatsSection() {
    const { documents_stats } = useSelector((store) => store.applicants);
    const { data } = useSelector((store) => store.app);
    console.log("data", data?.user?.is_passed);
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-3">
                <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg font-medium text-blue-700 shadow-sm">
                    Total: {documents_stats?.total ?? 0}
                </div>
                <div className="bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-lg font-medium text-yellow-700 shadow-sm">
                    Pending: {documents_stats?.pending ?? 0}
                </div>
                <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-lg font-medium text-green-700 shadow-sm">
                    Approved: {documents_stats?.approved ?? 0}
                </div>
                <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-lg font-medium text-red-700 shadow-sm">
                    Declined: {documents_stats?.declined ?? 0}
                </div>
                <div className="bg-purple-50 border border-purple-200 px-4 py-2 rounded-lg font-medium text-purple-700 shadow-sm">
                    Re-Uploaded: {documents_stats?.re_uploaded ?? 0}
                </div>
            </div>
            {data?.user?.is_passed && (
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                    <a
                        target="_blank"
                        href={`/accounts/my_documents/${data?.user?.id}/contract`}
                        className="bg-blue-500 hover:bg-blue-600 rounded-md text-white p-3 text-center text-sm font-semibold"
                    >
                        EMPLOYMENT CONTRACT
                    </a>
                    <a
                        target="_blank"
                        href={`/accounts/my_documents/${data?.user?.id}/onboarding`}
                        className="bg-purple-500 hover:bg-purple-600 rounded-md text-white p-3 text-center text-sm font-semibold"
                    >
                        ONBOARDING DOCUMENTS
                    </a>
                </div>
            )}
        </div>
    );
}
