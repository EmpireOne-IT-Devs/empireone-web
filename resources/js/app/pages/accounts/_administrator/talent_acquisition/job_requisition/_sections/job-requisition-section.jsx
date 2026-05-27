import React, { useEffect, useState } from "react";
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
import DeclinedJobRequisitionSection from "./declined-job-requisition-section";
import { useSelector } from "react-redux";
import { BriefcaseIcon } from "lucide-react";

export default function JobRequisitionBodySection({ job_requisition }) {
    const [open, setOpen] = useState(false);
    const queryParams = new URLSearchParams(window.location.search);
    const { data } = useSelector((store) => store.app);
    console.log("data", data?.user?.id);
    const id = queryParams.get("id");
    const my_requisition = window.location.pathname.split('/')['3']

    useEffect(() => {
        if (id == job_requisition.id) {
            setOpen(true);
        }
    }, [id, job_requisition.id]);

    const getStatusVariant = (status) => {
        switch (status) {
            case "Pending":
                return "warning";
            case "Director Approved":
            case "Final Approved":
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

    const statusColors = {
        Pending: "bg-yellow-200 text-yellow-800",
        "Director Approved": "bg-green-200 text-green-800",
        "Final Approved": "bg-green-200 text-green-800",
        Declined: "bg-red-200 text-red-800",
        Posted: "bg-purple-200 text-purple-800",
    };

    return (
        <>
            {/* Added w-full and text-left so the button behaves like a block container */}
            <button
                onClick={() => setOpen(true)}
                className="flex flex-col gap-4 w-full text-left"
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {job_requisition.title}
                            </h3>

                            <div className="flex flex-wrap items-center gap-2">
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

                                <Badge
                                    showDot={false}
                                    variant="purple"
                                    label={`Recruiter: ${job_requisition?.recruiter?.name}`}
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
                            {moment(job_requisition.created_at).format(
                                "MMDDYYHHmm",
                            )}
                            {job_requisition.id}
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 shrink-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent double-triggering the outer button
                                setOpen(true);
                            }}
                        >
                            <TbEye className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Removed mr-20 to prevent weird gaps on mobile */}
                <div className="flex flex-wrap items-center justify-start gap-4 sm:gap-6 text-sm text-black w-full">
                    <div className="flex items-center gap-2 shrink-0">
                        <TbBuilding className="text-gray-600 w-4 h-4" />
                        <span>{job_requisition?.department?.name}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <TbMapPin className="text-gray-600 w-4 h-4" />
                        <span className="capitalize">
                            {job_requisition?.location?.name}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <TbUsers className="text-gray-600 w-4 h-4" />
                        <span>
                            0/
                            {job_requisition.number_of_positions} position
                            {job_requisition.number_of_positions > 1
                                ? "s"
                                : ""}{" "}
                            needed
                        </span>
                    </div>

                    {/* <div className="flex items-center gap-2 shrink-0">
                        <TbCurrencyDollar className="text-gray-600 w-4 h-4" />
                        <span>{job_requisition.salary_range}</span>
                    </div> */}
                </div>

                <hr className="border-gray-200 w-full" />

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-sm text-gray-600 w-full">
                    <div className="flex items-center gap-2">
                        <LuUser className="shrink-0" />
                        <span>{job_requisition?.user?.name || "N/A"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <TbCalendar className="shrink-0" />
                        <span className="capitalize">
                            {formatDate(job_requisition.created_at)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm sm:ml-auto">
                        <TbCalendarEvent className="text-gray-600 shrink-0" />
                        <span className="font-medium text-gray-600">
                            Fill Rate: 80%
                        </span>
                    </div>
                </div>
            </button>

            <Modal
                width="max-w-7xl"
                isOpen={open}
                title={
                    <div className="flex items-center gap-3 p-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                            <BriefcaseIcon />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                                Confirm Action
                            </p>
                            <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                Job Requisition Details
                            </h2>
                        </div>
                    </div>
                }
                onClose={() => setOpen(false)}
            >
                {/* Responsive split: stack on small screens, row on large screens */}
                <div className="flex flex-col lg:flex-row max-h-[75vh] overflow-hidden">
                    <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto no-scrollbar">
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                                    {job_requisition.title || "N/A"}
                                </h1>
                                {job_requisition.type === "New Position" && (
                                    <span className="bg-blue-50 text-blue-600 text-xs sm:text-sm font-medium px-3 py-1 rounded flex items-center gap-1">
                                        ✨ New Position
                                    </span>
                                )}
                            </div>

                            <div className="text-gray-900 text-sm">
                                JRID-
                                {moment(job_requisition.created_at).format(
                                    "MMDDYYHHmm",
                                )}
                                {job_requisition.id}
                            </div>

                            <div className="flex flex-wrap gap-2 border-t pt-4">
                                <span
                                    className={`px-3 py-1 rounded text-sm font-medium ${statusColors[job_requisition.status] ||
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

                            {/* Responsive Grid: 1 col on mobile, 2 on tablet, 4 on large screens */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4 pt-4">
                                <div>
                                    <div className="text-gray-500 text-sm mb-1">
                                        Department
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        {job_requisition?.department?.name ||
                                            "N/A"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-500 text-sm mb-1">
                                        Location
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        {job_requisition?.location?.name ||
                                            "N/A"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-500 text-sm mb-1">
                                        Employment Type
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        {job_requisition.employment_type ||
                                            "N/A"}
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
                                        {job_requisition?.salary_range || "N/A"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-500 text-sm mb-1">
                                        Requested By
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        {job_requisition?.user?.name || "N/A"}
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
                                    <TbCalendarEvent className="text-blue-600 shrink-0" />
                                    Interview Schedule
                                </h3>

                                {/* Stack on mobile, side-by-side on tablet/desktop */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-600 mb-2">
                                            Final Interviewer
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {job_requisition.interviewer1 ||
                                                "Not Assigned"}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-600 mb-2">
                                            Sub-Interviewer
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {job_requisition.interviewer2 ||
                                                "Not Assigned"}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                        <p className="text-sm text-gray-600 mb-1">
                                            Interview Availability
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {job_requisition?.availability1 || "N/A"}
                                        </p>
                                    </div>

                                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                        <p className="text-sm text-gray-600 mb-1">
                                            Interview Time
                                        </p>
                                        <p className="font-semibold text-gray-900">
                                            {formatTime(
                                                job_requisition.interview_time1,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Text blocks: added text-sm for better mobile readability */}
                            <div className="mt-4 space-y-6 pt-4 text-gray-800 text-sm sm:text-base">
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

                    {/* Logs Section: 100% width on mobile, 1/3 width on desktop */}
                    <div className="w-full lg:w-1/3 border-t lg:border-t-0 lg:border-l bg-gray-50/50 p-4 sm:p-6 shrink-0 overflow-y-auto no-scrollbar">
                        <h3 className="font-semibold text-lg mb-4">
                            Activity Logs
                        </h3>
                        <JobRequisitionLogsSection
                            job_requisition={job_requisition}
                        />
                        {
                            my_requisition != 'my_requisition' && <div className="mt-16 pb-16">
                                <DeclinedJobRequisitionSection
                                    data={job_requisition}
                                />
                            </div>
                        }
                    </div>
                </div>

                {
                    my_requisition != 'my_requisition' && <div className="flex flex-col sm:flex-row w-full items-center justify-between border-t gap-3 p-4 bg-white sticky bottom-0">
                        {(job_requisition.status == "Pending" &&
                            job_requisition.approver1_id == data?.user?.id) && (
                                <ApproveJobRequisitionSection
                                    data={job_requisition}
                                />
                            )}

                        {(job_requisition.status == "In Progress" &&
                            job_requisition.approver2_id == data?.user?.id) && (
                                <ApproveJobRequisitionSection
                                    data={job_requisition}
                                />
                            )}

                        {(job_requisition.status == "Director Approved" &&
                            job_requisition.approver3_id == data?.user?.id) && (
                                <ApproveJobRequisitionSection
                                    data={job_requisition}
                                />
                            )}
                    </div>
                }


            </Modal>
        </>
    );
}
