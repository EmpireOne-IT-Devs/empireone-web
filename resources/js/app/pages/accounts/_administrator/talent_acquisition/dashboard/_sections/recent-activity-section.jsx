import Card from "@/app/_components/card";
import StatusIndicator from "@/app/_components/indicator";
import React from "react";

export default function RecentActivitySection() {
    const activities = [
        {
            variant: "primary",
            label: "New application for Senior Software Engineer",
            time: "5 min ago",
            user: "John Smith",
        },
        {
            variant: "primary",
            label: "Interview scheduled for HR Manager",
            time: "1 hour ago",
            user: "Sarah Johnson",
        },
        {
            variant: "success",
            label: "Candidate shortlisted for Marketing Specialist",
            time: "2 hours ago",
            user: "Mike Chen",
        },
        {
            variant: "primary",
            label: "New job posting created: Accountant",
            time: "3 hours ago",
            user: "System",
        },
        {
            variant: "danger",
            label: "Application rejected for Senior Software Engineer",
            time: "4 hours ago",
            user: "David Lee",
        },
    ];

    return (
        <Card className="flex-1 flex flex-col gap-3">
            <div className=" pb-2 mb-3 flex items-center justify-between">
                <div className="text-xl font-bold">Recent Activity</div>
                <div className="text-blue-600 font-bold">View All</div>
            </div>

            {activities.map((item, index) => (
                <div key={index} className="py-2">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                            <StatusIndicator
                                variant={item.variant}
                                size="sm"
                                className="mt-1"
                            />
                            <p className="text-md font-medium text-gray-900">
                                {item.label}
                            </p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                            {item.time}
                        </span>
                    </div>
                    <p className="ml-5 text-sm text-gray-600">{item.user}</p>
                </div>
            ))}
        </Card>
    );
}
