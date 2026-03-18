import React from "react";
import Card from "@/app/_components/card";
import {
    TbBriefcase,
    TbMapPin,
    TbClock,
    TbCurrencyDollar,
    TbEye,
    TbUsers,
} from "react-icons/tb";
import Badge from "@/app/_components/badge";

const STATIC_JOB_POSTINGS = [
    {
        id: 1,
        status: "Active",
        posting_type: "Both",
        posted: "12/1/2024",
        application_deadline: "12/31/2024",
        job_requisition: {
            title: "Senior Software Engineer",
            employment_type: "Full-time",
            salary_range: "₱80,000 - ₱120,000",
            department: { name: "IT" },
            location: { name: "Manila" },
        },
    },
    {
        id: 2,
        status: "Draft",
        posting_type: "Internal",
        posted: "12/5/2024",
        application_deadline: "1/15/2025",
        job_requisition: {
            title: "Product Designer",
            employment_type: "Full-time",
            salary_range: "₱60,000 - ₱90,000",
            department: { name: "Design" },
            location: { name: "Cebu" },
        },
    },
    {
        id: 3,
        status: "Closed",
        posting_type: "External",
        posted: "11/1/2024",
        application_deadline: "11/30/2024",
        job_requisition: {
            title: "HR Specialist",
            employment_type: "Part-time",
            salary_range: "₱30,000 - ₱45,000",
            department: { name: "Human Resources" },
            location: { name: "Remote" },
        },
    },
];

export default function JobPostingCardSection() {
    const job_postings = STATIC_JOB_POSTINGS;

    return (
        <div className="flex flex-col gap-3">
            {job_postings.map((job) => (
                <Card
                    key={job.id}
                    className="border rounded-xl px-6 py-5 cursor-pointer hover:shadow-sm transition-shadow"
                >
                    <div className="flex flex-col gap-3">
                        {/* Top row: title + badges + eye icon */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {job?.job_requisition?.title}
                                </h3>

                                {/* Status badge */}
                                <Badge
                                    showDot={false}
                                    className="rounded-full px-3 py-0.5 text-xs"
                                    variant={
                                        job.status === "Active"
                                            ? "success"
                                            : job.status === "Draft"
                                              ? "warning"
                                              : job.status === "Closed"
                                                ? "primary"
                                                : "default"
                                    }
                                    label={job.status}
                                />

                                {job.posting_type && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-700">
                                        <TbUsers className="w-3.5 h-3.5" />
                                        {job.posting_type}
                                    </span>
                                )}
                            </div>

                            <TbEye className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0" />
                        </div>

                        <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1.5">
                                <TbBriefcase className="w-4 h-4" />
                                {job?.job_requisition?.department?.name}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <TbMapPin className="w-4 h-4" />
                                {job?.job_requisition?.location?.name}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <TbClock className="w-4 h-4" />
                                {job?.job_requisition?.employment_type}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <TbCurrencyDollar className="w-4 h-4" />
                                {job?.job_requisition?.salary_range
                                    ? job.job_requisition.salary_range
                                    : "Salary not specified"}
                            </div>
                        </div>

                        <hr className="border-gray-200 dark:border-white/10" />

                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <div>Posted: {job.posted}</div>
                            <div>Deadline: {job.application_deadline}</div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
