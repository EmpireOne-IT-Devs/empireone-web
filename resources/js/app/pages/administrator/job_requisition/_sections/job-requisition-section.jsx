import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ApproveJobRequisitionSection from "./approve-job-requisition-section";
import Badge from "@/app/_components/badge";
import moment from "moment";
import Button from "@/app/_components/button";
import {
    TbBuilding,
    TbCalendar,
    TbCalendarEvent,
    TbCurrencyDollar,
    TbEye,
    TbMapPin,
    TbUsers,
} from "react-icons/tb";
import { LuUser } from "react-icons/lu";
import Modal from "@/app/_components/modal";
import JobRequisitionLogsSection from "./job-requisition-logs-section";
import CreateJobPostingSection from "./create-job-posting-section";
import DeclinedJobRequisitionSection from "./declined-job-requisition-section";

export default function JobRequisitionBodySection({ job_requisition }) {
    const [open, setOpen] = useState(false);
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");

    useEffect(() => {
        if (id == job_requisition.id) {
            setOpen(true);
        }
    }, []);

    const getStatusVariant = (status) => {
        switch (status) {
            case "Pending":
                return "warning";
            case "Approved":
                return "success";
            case "Declined":
                return "danger";
            case "In Progress":
                return "info";
            case "Posted":
                return "purple";
            default:
                return "info";
        }
    };

    const getPriorityVariant = (priority) => {
        switch (priority?.toLowerCase()) {
            case "urgent":
            case "high priority":
                return "destructive";
            case "medium priority":
                return "primary";
            case "low priority":
                return "default";
            default:
                return "default";
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return "Not Scheduled";
        const [hours, minutes] = timeString.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    if (!job_requisition) return <div>Loading...</div>;

    // Status badge color mapping
    const statusColors = {
        Pending: "bg-yellow-200 text-yellow-800",
        Approved: "bg-green-200 text-green-800",
        Declined: "bg-red-200 text-red-800",
        Posted: "bg-purple-200 text-purple-800",
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex flex-col gap-4"
            >
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {job_requisition.title}
                            </h3>

                            <div className="flex items-center gap-2">
                                <Badge
                                    showDot={false}
                                    className="rounded-md px-3 py-1 text-xs font-medium"
                                    variant={getStatusVariant(
                                        job_requisition.status ?? "",
                                    )}
                                    label={job_requisition.status ?? ""}
                                />

                                <Badge
                                    showDot={false}
                                    className="rounded-md px-3 py-1 text-xs font-medium"
                                    variant={getPriorityVariant(
                                        job_requisition.priority,
                                    )}
                                    label={job_requisition.priority}
                                />

                                {job_requisition.type === "New Position" && (
                                    <Badge
                                        outlined
                                        showDot={false}
                                        className="rounded-md px-3 py-1 text-xs font-medium"
                                        variant="primary"
                                        label="✨ New"
                                    />
                                )}

                                {job_requisition.type ===
                                    "Existing Position" && (
                                    <Badge
                                        outlined
                                        showDot={false}
                                        className="rounded-md px-3 py-1 text-xs font-medium"
                                        variant="purple"
                                        label="📋 Existing"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="text-sm text-gray-700 font-medium justify-start items-center flex gap-2">
                            JRID-
                            {moment(job_requisition.created_at).format("mdyhs")}
                            {job_requisition.id}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(true)}
                        >
                            <TbEye className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-6 text-sm text-black">
                    <div className="flex items-center gap-2">
                        <TbBuilding className="text-gray-600" />
                        <span>{job_requisition?.department?.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <TbMapPin className="text-gray-600" />
                        <span className="capitalize">
                            {job_requisition?.location?.name}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <TbUsers className="text-gray-600" />
                        <span>
                            0/
                            {job_requisition.number_of_positions} position
                            {job_requisition.number_of_positions > 1
                                ? "s"
                                : ""}{" "}
                            needed
                        </span>
                    </div>

                    <div className="flex items-center gap-2 mr-20">
                        <TbCurrencyDollar className="text-gray-600" />
                        <span>{job_requisition.salary_range}</span>
                    </div>
                </div>

                <hr className="border-gray-200" />

                <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <LuUser />
                            <span>{job_requisition?.user?.name || "N/A"}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <TbCalendar />
                            <span className="capitalize">
                                {formatDate(job_requisition.created_at)}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm ml-auto">
                            <TbCalendarEvent className="text-gray-600" />
                            <span className="font-medium text-gray-600">
                                1 event
                            </span>
                        </div>
                    </div>
                </div>
            </button>
            <Modal
                width="max-w-7xl"
                isOpen={open}
                title="Job Requisition"
                onClose={() => setOpen(false)}
                className="overflow-auto h-full"
            >
                <div className="flex overflow-auto h-[75vh]">
                    <div className="flex-1 p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {job_requisition.title || "N/A"}
                                </h1>
                                <span className="bg-blue-50 text-blue-600 text-sm font-medium px-3 py-1 rounded flex items-center gap-1">
                                    ✨ New Position
                                </span>
                            </div>
                            <div className="text-gray-900 text-sm">
                                JRID-
                                {moment(job_requisition.created_at).format(
                                    "mdyhs",
                                )}
                                {job_requisition.id}
                            </div>
                            <div className="flex gap-2 border-t pt-4">
                                <span
                                    className={`px-3 py-1 rounded text-sm font-medium ${
                                        statusColors[job_requisition.status] ||
                                        "bg-yellow-100 text-yellow-800"
                                    }`}
                                >
                                    {job_requisition.status || "Pending"}
                                </span>
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium">
                                    {job_requisition.priority ||
                                        "Medium Priority"}
                                </span>
                                <span className="bg-blue-100 text-green-800 px-3 py-1 rounded text-sm font-medium">
                                    {job_requisition?.account?.name ?? "N/A"}
                                </span>
                            </div>
                            <div className="grid grid-cols-4 gap-x-8 gap-y-4 pt-4">
                                <div>
                                    <div className="text-gray-500 text-sm mb-1">
                                        Department
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        {job_requisition?.department?.name ||
                                            "Marketing"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-500 text-sm mb-1">
                                        Location
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        {job_requisition?.location?.name ||
                                            "Manila HQ"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-500 text-sm mb-1">
                                        Employment Type
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        {job_requisition.employment_type ||
                                            "Full-time"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-500 text-sm mb-1">
                                        Positions
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        0/
                                        {job_requisition?.number_of_positions ||
                                            "0"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-500 text-sm mb-1">
                                        Salary Range
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        {job_requisition?.salary_range ||
                                            "₱30,000 - ₱40,000"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-500 text-sm mb-1">
                                        Requested By
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        <span>
                                            {job_requisition?.user?.name ||
                                                "N/A"}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-500 text-sm mb-1">
                                        Date Requested
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        {job_requisition?.created_at
                                            ? moment(
                                                  job_requisition.created_at,
                                              ).format("LL")
                                            : "N/A"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-500 text-sm mb-1">
                                        Target Start Date
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        {job_requisition?.target_start_date
                                            ? moment(
                                                  job_requisition.target_start_date,
                                              ).format("LL")
                                            : "N/A"}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-5 pb-5 pt-5">
                                <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <TbCalendarEvent className="text-blue-600" />
                                    Interview Schedule
                                </h3>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-600 mb-2">
                                            Final Interviewer
                                        </p>
                                        <p className="font-semibold text-gray-900 mb-1">
                                            {job_requisition.interviewer ||
                                                "Not Assigned"}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-600 mb-2">
                                            Sub-Interviewer
                                        </p>
                                        <p className="font-semibold text-gray-900 mb-1">
                                            {job_requisition.sub_interviewer ||
                                                "Not Assigned"}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5 mt-4">
                                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                        <p className="text-sm text-gray-600 mb-1">
                                            Interview Date
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {job_requisition?.interview_date
                                                ? moment(
                                                      job_requisition.interview_date,
                                                  ).format("LL")
                                                : "N/A"}
                                        </p>
                                    </div>

                                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                        <p className="text-sm text-gray-600 mb-1">
                                            Interview Time
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {formatTime(
                                                job_requisition.interview_time,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 space-y-6 pt-4 text-gray-800">
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
                    </div>
                    <div className="w-1/3">
                        <JobRequisitionLogsSection
                            job_requisition={job_requisition}
                        />
                    </div>
                </div>
                <div className="flex w-full items-center justify-between border-t  gap-3 pt-3 ">
                    <div>
                        {job_requisition.status == "Approved" &&
                            !job_requisition.job_posting && (
                                <CreateJobPostingSection
                                    initial_data={job_requisition}
                                />
                            )}
                    </div>
                    {!job_requisition.job_posting && (
                        <div className="flex gap-3">
                            <DeclinedJobRequisitionSection
                                data={job_requisition}
                            />
                            <ApproveJobRequisitionSection
                                data={job_requisition}
                            />
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
}
