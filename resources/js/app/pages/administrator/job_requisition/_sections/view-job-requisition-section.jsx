import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";

import React from "react";

import { TbEye, TbTrash } from "react-icons/tb";
import { useSelector } from "react-redux";

export default function ViewJobRequisitionSection({ open, setOpen }) {
    const { selectedJobRequisition } = useSelector(
        (state) => state.job_requisitions,
    );

    if (!open || !selectedJobRequisition) return null;

    const getStatusVariant = (status) => {
        const variants = {
            pending: "warning",
            approved: "success",
            rejected: "danger",
        };
        return variants[status?.toLowerCase()] || "warning";
    };

    const getPriorityVariant = (priority) => {
        const variants = {
            low: "success",
            medium: "primary",
            high: "warning",
            urgent: "danger",
        };
        return variants[priority?.toLowerCase()] || "primary";
    };

    const formatDate = (dateString) =>
        new Date(dateString).toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
        });

    const formatDateTime = (dateString) =>
        new Date(dateString).toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

    const formatTime = (timeString) => {
        if (!timeString) return "N/A";
        const [hours, minutes] = timeString.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    return (
        <Modal width="max-w-6xl" isOpen={open} onClose={() => setOpen(false)}>
            <div className="flex flex-col max-h-[90vh]">
                <div className="mb-4 pb-2 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                {selectedJobRequisition.position_title}
                            </h2>

                            {selectedJobRequisition.position_type === "new" && (
                                <Badge
                                    showDot={false}
                                    variant="primary"
                                    label="✨ New"
                                    className="rounded-md px-3 py-1 text-xs font-medium"
                                />
                            )}
                            {selectedJobRequisition.position_type ===
                                "existing" && (
                                <Badge
                                    showDot={false}
                                    variant="primary"
                                    label="📋 Existing"
                                    className="rounded-md px-3 py-1 text-xs font-medium"
                                />
                            )}
                        </div>
                    </div>

                    <p className="text-sm text-gray-600">
                        {selectedJobRequisition.requisition_id}
                    </p>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    <div className="flex-1 p-6 bg-white overflow-y-auto">
                        <div className="flex items-center gap-2 mb-5">
                            <Badge
                                showDot={false}
                                variant={getStatusVariant(
                                    selectedJobRequisition.status || "pending",
                                )}
                                label={
                                    selectedJobRequisition.status || "Pending"
                                }
                                className="rounded-md px-3 py-1.5 text-xs font-medium"
                            />
                            <Badge
                                showDot={false}
                                variant={getPriorityVariant(
                                    selectedJobRequisition.priority,
                                )}
                                label={`${selectedJobRequisition.priority} Priority`}
                                className="rounded-md px-3 py-1.5 text-xs font-medium"
                            />
                        </div>

                        <div className="grid grid-cols-4 gap-5 mb-5 pb-5">
                            <div>
                                <p className="text-sm text-gray-600 mb-0.5">
                                    Department
                                </p>
                                <p className="font-semibold text-gray-900">
                                    {selectedJobRequisition.department}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-0.5">
                                    Location
                                </p>
                                <p className="font-semibold text-gray-900">
                                    {selectedJobRequisition.location}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-0.5">
                                    Employment Type
                                </p>
                                <p className="font-semibold text-gray-900 capitalize">
                                    {selectedJobRequisition.employment_type}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-0.5">
                                    Positions
                                </p>
                                <p className="font-semibold text-gray-900">
                                    {selectedJobRequisition.number_of_positions}
                                    /1
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-5 mb-5 pb-5">
                            <div>
                                <p className="text-sm text-gray-600 mb-0.5">
                                    Salary Range
                                </p>
                                <p className="font-semibold text-gray-900">
                                    ₱{selectedJobRequisition.salary_range}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-0.5">
                                    Requested By
                                </p>
                                <p className="font-semibold text-gray-900">
                                    Jane Smith
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-0.5">
                                    Date Requested
                                </p>
                                <p className="font-semibold text-gray-900">
                                    {formatDate(
                                        selectedJobRequisition.created_at,
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-0.5">
                                    Target Start Date
                                </p>
                                <p className="font-semibold text-gray-900">
                                    {formatDate(
                                        selectedJobRequisition.target_start_date,
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Interview Schedule Section
                        <div className="mb-5 pb-5 border-t pt-5">
                            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <svg
                                    className="w-5 h-5 text-gray-700"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                Interview Schedule
                            </h3>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Final Interviewer
                                    </p>
                                    <p className="font-semibold text-gray-900 mb-1">
                                        {selectedJobRequisition.final_interviewer_name || "Not Assigned"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {selectedJobRequisition.final_interviewer_email || ""}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-2">
                                        Sub-Interviewer
                                    </p>
                                    <p className="font-semibold text-gray-900 mb-1">
                                        {selectedJobRequisition.sub_interviewer_name || "Not Assigned"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {selectedJobRequisition.sub_interviewer_email || ""}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5 mt-4">
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <p className="text-sm text-gray-600 mb-1">
                                        Interview Date
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {selectedJobRequisition.interview_date
                                            ? formatDate(selectedJobRequisition.interview_date)
                                            : "Not Scheduled"}
                                    </p>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <p className="text-sm text-gray-600 mb-1">
                                        Interview Time
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        {formatTime(selectedJobRequisition.interview_time)}
                                    </p>
                                </div>
                            </div>
                        </div> */}

                        <div className="mb-5 pb-5">
                            <h3 className="text-base font-semibold text-gray-900 mb-2">
                                Business Justification
                            </h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {
                                    selectedJobRequisition.justification_for_position
                                }
                            </p>
                        </div>

                        <div className="mb-5 pb-5">
                            <h3 className="text-base font-semibold text-gray-900 mb-2">
                                Required Qualifications
                            </h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {selectedJobRequisition.required_qualifications}
                            </p>
                        </div>

                        <div className="mb-5 pb-5">
                            <h3 className="text-base font-semibold text-gray-900 mb-2">
                                Key Responsibilities
                            </h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {selectedJobRequisition.key_responsibilities}
                            </p>
                        </div>
                    </div>
                    <div className="w-80 bg-gray-100 rounded-lg p-5 overflow-y-auto max-h-full">
                        <div className="flex items-center gap-2 mb-5 ">
                            <svg
                                className="w-5 h-5 text-gray-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Timeline
                            </h3>
                        </div>

                        <div className="relative pl-7 pb-7 space-y-5">
                            <div className="absolute left-0 top-1 w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                                <div className="w-3.5 h-3.5 bg-blue-500 rounded-full" />
                            </div>

                            <div className="absolute left-3.5 top-8 bottom-0 w-0.5 bg-gray-300" />

                            <div className="bg-white rounded-lg p-4 shadow-sm ml-2">
                                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                                    Requisition created
                                </h4>
                                <p className="text-xs text-gray-600 mb-1.5">
                                    Jane Smith
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatDateTime(
                                        selectedJobRequisition.created_at,
                                    )}
                                </p>
                                <p className="text-sm text-gray-700 mt-2">
                                    Requesting marketing support for Q1
                                    campaigns
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-3 mt-3 flex-shrink-0 p-4">
                    <Button outlined variant="danger">
                        <TbTrash className="w-5 h-5 mr-2" />
                        Delete
                    </Button>

                    <div className="flex items-center gap-3">
                        <Button variant="primary">
                            <TbEye className="w-5 h-5 mr-2" />
                            Review
                        </Button>
                        <Button
                            variant="secondary"
                            outlined
                            onClick={() => setOpen(false)}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
