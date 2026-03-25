import Badge from "@/app/_components/badge";
import Card from "@/app/_components/card";
import { Clock } from "lucide-react";
import React from "react";

import {
    TbBriefcase,
    TbMapPin,
    TbClock,
    TbCurrencyDollar,
    TbUsers,
} from "react-icons/tb";
import ApplicationDetailSection from "./application-detail-section";

export default function ApplicationCardSection() {
    const STATIC_JOB_POSTINGS = [
        {
            id: 1,
            status: "New",
            application: "12/1/2024",
            application_deadline: "12/31/2024",
            applications: [{}, {}],
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
            status: "Initial interview Scheduled",
            posting_type: "Internal",
            application: "12/5/2024",
            applications: [{}],
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
            status: "Passed Initial Interview",
            posting_type: "External",
            application: "11/1/2024",
            applications: [],
            job_requisition: {
                title: "HR Specialist",
                employment_type: "Part-time",
                salary_range: "₱30,000 - ₱45,000",
                department: { name: "Human Resources" },
                location: { name: "Remote" },
            },
        },
    ];

    return (
        <div>
            <div className="flex flex-col gap-3">
                {STATIC_JOB_POSTINGS.map((job) => (
                    <Card>
                        <div className="flex flex-col gap-3">
                            {/* Top row */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                                        {job?.job_requisition?.title}
                                    </h3>

                                    <Badge
                                        showDot={false}
                                        className="rounded-full px-3 py-0.5 text-xs"
                                        variant={
                                            job.status === "New"
                                                ? "success"
                                                : job.status === "Initial interview Scheduled"
                                                  ? "warning"
                                                  : job.status === "Passed Initial Interview"
                                                    ? "primary  "
                                                    : "default"
                                        }
                                        label={job.status}
                                    />
                                </div>
                                <div className="flex items-end justify-end mr-4 mt-2">
                                    <ApplicationDetailSection />
                                </div>
                            </div>

                            {/* Details */}
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
                                    {job?.job_requisition?.salary_range ||
                                        "Salary not specified"}
                                </div>
                            </div>

                            <hr className="border-gray-200 dark:border-white/10" />

                            <div className="flex items-center justify-between text-sm text-blue-500 dark:text-gray-400">
                                <div>
                                    <Clock className="w-4 h-4 inline-block mr-1 mb-1" />
                                    Application Submitted
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
