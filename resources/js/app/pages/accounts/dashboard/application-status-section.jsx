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
        <Card 
            outlined 
            padding="p-4" 
            className="hover:shadow-md transition-shadow duration-200 gap-0 border-gray-100"
        >
            {/* Title - allow wrapping on very small screens */}
            <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 leading-snug">
                {app.title}
            </h3>

            {/* Department */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <BriefcaseIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate">{app.department}</span>
            </div>

            {/* Status Badge - Using w-fit and leading-none to keep it tight */}
            <div className="mb-4">
                <Badge 
                    label={app.status} 
                    variant 
                    className="w-fit text-[10px] sm:text-xs py-1 px-2.5" 
                />
            </div>

            {/* Date Footer */}
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-400 pt-3 border-t border-gray-50">
                <CalendarIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Applied on {app.appliedDate}</span>
            </div>
        </Card>
    );
}

export default function ApplicationStatusSection() {
    return (
        <div className="mt-8 px-4 sm:px-0">
            <Card padding="p-0" className="w-full overflow-hidden border-gray-200">
                {/* Header - Sticky on mobile so you know what list you're in while scrolling */}
                <div className="sticky top-0 bg-white z-10 flex items-center gap-2 p-4 border-b border-gray-100">
                    <File className="w-4 h-4 text-blue-600" />
                    <h2 className="text-base font-bold text-gray-900">
                        Application Status
                    </h2>
                </div>

                {/* List Container */}
                <div className="flex flex-col gap-3 p-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                    {applications.length > 0 ? (
                        applications.map((app) => (
                            <ApplicationCard key={app.id} app={app} />
                        ))
                    ) : (
                        <div className="py-8 text-center text-sm text-gray-400">
                            No active applications found.
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}