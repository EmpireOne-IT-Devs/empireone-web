import Card from "@/app/_components/card";
import Badge from "@/app/_components/badge";
import { BriefcaseIcon, CalendarIcon, File } from "lucide-react";
import React from "react";

const applications = [
    {
        id: 1,
        title: "Senior Software Engineer",
        department: "IT",
        status: "New",
        statusColor: "blue",
        appliedDate: "3/25/2026",
    },
    {
        id: 2,
        title: "HR Manager",
        department: "Human Resources",
        status: "Initial Interview Scheduled",
        statusColor: "purple",
        appliedDate: "3/18/2026",
    },
    {
        id: 3,
        title: "Senior Data Analyst",
        department: "Business Analytics",
        status: "Passed Initial Interview",
        statusColor: "purple",
        appliedDate: "3/11/2026",
    },
];

function ApplicationCard({ app }) {
    return (
        <Card outlined padding="p-4" className="hover:shadow-sm gap-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {app.title}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                <BriefcaseIcon className="w-4 h-4 text-blue-400" />
                {app.department}
            </div>

            <Badge label={app.status} variant className="mb-3 w-fit" />

            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
                Applied {app.appliedDate}
            </div>
        </Card>
    );
}

export default function ApplicationStatusSection() {
    return (
        <div className="mt-8">
            <Card padding="p-4" className="w-full gap-0">
                {/* Header */}
                <div className="flex items-center gap-2 pb-4 border-b border-gray-100 mb-4">
                    <File className="w-4 h-4 " />
                    <h2 className="text-base font-semibold text-gray-900">
                        Application Status
                    </h2>
                </div>

                <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
                    {applications.map((app) => (
                        <ApplicationCard key={app.id} app={app} />
                    ))}
                </div>
            </Card>
        </div>
    );
}
