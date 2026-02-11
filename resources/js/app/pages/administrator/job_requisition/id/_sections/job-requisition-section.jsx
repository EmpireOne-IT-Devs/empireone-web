import React, { useState } from "react";
import { useSelector } from "react-redux";
import ApproveJobRequisitionSection from "./approve-job-requisition-section";

export default function JobRequisitionBodySection() {
    const { job_requisition } = useSelector((store) => store.job_requisitions);
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => setShowDetails((prev) => !prev);

    if (!job_requisition) return <div>Loading...</div>;

    // Status badge color mapping
    const statusColors = {
        pending: "bg-yellow-200 text-yellow-800",
        approved: "bg-green-200 text-green-800",
        rejected: "bg-red-200 text-red-800",
    };

    return (
        <div className="p-6 bg-white shadow rounded-lg space-y-6">
            {/* Header Section */}
            <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="text-2xl font-semibold">
                    {job_requisition.title || "N/A"}
                </div>
                <div className="text-2xl font-medium text-gray-600  p-2 border-2 px-3">
                    {job_requisition.employment_type || "N/A"}
                </div>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <div>
                    Department: {job_requisition?.department?.name || "N/A"}
                </div>
                <div>Location: {job_requisition?.location?.name || "N/A"}</div>
                <div>
                    Number of Positions:{" "}
                    {job_requisition?.number_of_positions || "N/A"}
                </div>
                <div>
                    Salary Range: {job_requisition?.salary_range || "N/A"}
                </div>
                <div>Urgency: {job_requisition?.priority || "N/A"}</div>
                <div>
                    Target Start Date:{" "}
                    {job_requisition?.target_start_date
                        ? new Date(
                              job_requisition.target_start_date,
                          ).toLocaleDateString()
                        : "N/A"}
                </div>
                <div>
                    Status:{" "}
                    <span
                        className={`px-2 py-1 rounded-full text-sm font-semibold ${
                            statusColors[job_requisition.status] ||
                            "bg-gray-200 text-gray-800"
                        }`}
                    >
                        {job_requisition.status || "N/A"}
                    </span>
                </div>
            </div>

            {/* Toggle Details Button */}
            <div className="flex w-full items-center justify-end">
                <ApproveJobRequisitionSection />
           
            </div>

            <div className="mt-4 space-y-6 border-t pt-4 text-gray-800">
                {job_requisition.justification_for_position && (
                    <div>
                        <h3 className="font-semibold text-lg mb-2">
                            Justification for Position
                        </h3>
                        <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: job_requisition.justification_for_position,
                            }}
                        />
                    </div>
                )}

                {job_requisition.qualifications && (
                    <div>
                        <h3 className="font-semibold text-lg mb-2">
                            Qualifications
                        </h3>
                        <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: job_requisition.qualifications,
                            }}
                        />
                    </div>
                )}

                {job_requisition.responsibilities && (
                    <div>
                        <h3 className="font-semibold text-lg mb-2">
                            Responsibilities
                        </h3>
                        <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: job_requisition.responsibilities,
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
