import React from "react";
import {
    TbCalendarEvent,
    TbMapPin,
    TbTag,
    TbUser,
    TbEye,
    TbCurrencyPeso,
    TbCalendar,
    TbUsers,
} from "react-icons/tb";
import Badge from "@/app/_components/badge";
import Card from "@/app/_components/card";

const STATIC_JOB_POSTINGS = [
    {
        id: 1,
        title: "HR Officer",
        status: "Pending",
        priority: "High",
        is_new: true,
        requisition_code: "REQ-2024-004",
        department: "Human Resources",
        location: "Manila HQ",
        filled_positions: 1,
        open_positions: 2,
        salary_min: 30000,
        salary_max: 40000,
        posted_by: "Jane Smith",
        posted_date: "2024-02-01",
        events_count: 2,
    },
    {
        id: 2,
        title: "IT Support Staff",
        status: "Pending",
        priority: "Medium",
        is_new: false,
        requisition_code: "REQ-2024-005",
        department: "IT Department",
        location: "Quezon City",
        filled_positions: 0,
        open_positions: 1,
        salary_min: 25000,
        salary_max: 30000,
        posted_by: "John Doe",
        posted_date: "2024-01-25",
        events_count: 1,
    },
];

export default function JobRequisitionCardSection() {
    const getStatusVariant = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "warning";
            case "draft":
                return "success";
            case "closed":
                return "primary";
            default:
                return "default";
        }
    };

    const getPriorityVariant = (priority) => {
        switch (priority?.toLowerCase()) {
            case "high":
                return "destructive";
            case "medium":
                return "primary";
            case "low":
                return "default";
            default:
                return "default";
        }
    };

    return (
        <div className="flex flex-col gap-3">
            {STATIC_JOB_POSTINGS.map((job) => (
                <Card key={job.id} className="border rounded-xl p-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {job.title}
                                    </h3>

                                    <div className="flex items-center gap-2">
                                        <Badge
                                            showDot={false}
                                            className="rounded-md px-3 py-1 text-xs font-medium"
                                            variant={getStatusVariant(
                                                job.status,
                                            )}
                                            label={job.status}
                                        />

                                        <Badge
                                            showDot={false}
                                            className="rounded-md px-3 py-1 text-xs font-medium"
                                            variant={getPriorityVariant(
                                                job.priority,
                                            )}
                                            label={job.priority}
                                        />

                                        {job.is_new && (
                                            <Badge
                                                showDot={false}
                                                className="rounded-md px-3 py-1 text-xs font-medium"
                                                variant="primary"
                                                label="★ New"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="text-sm text-gray-500 font-medium">
                                    {job.requisition_code}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded-md">
                                    <TbEye className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <TbTag />
                                <span>{job.department}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <TbMapPin />
                                <span>{job.location}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <TbUsers />
                                <span>
                                    {job.filled_positions}/{job.open_positions}{" "}
                                    filled
                                </span>
                            </div>

                            <div className="flex items-center gap-2 mr-20">
                                <TbCurrencyPeso />
                                <span>
                                    ₱{job.salary_min.toLocaleString()} - ₱
                                    {job.salary_max.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        <div className="flex flex-col gap-1 w-full">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <TbUser />
                                    <span className="font-medium">
                                        {job.posted_by}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <TbCalendar />
                                    <span>
                                        {new Date(
                                            job.posted_date,
                                        ).toLocaleDateString("en-US", {
                                            month: "numeric",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm ml-auto">
                                    <TbCalendarEvent className="text-gray-600" />
                                    <span className="font-medium text-gray-900">
                                        {job.events_count} events
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
