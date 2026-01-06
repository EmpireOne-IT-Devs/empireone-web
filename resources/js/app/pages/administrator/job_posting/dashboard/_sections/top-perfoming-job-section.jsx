import Badge from "@/app/_components/badge";
import Card from "@/app/_components/card";
import { CalendarIcon } from "@heroicons/react/24/outline";
import React from "react";
import { LuUsers } from "react-icons/lu";

export default function TopPerformingJobSection() {
    const jobs = [
        {
            title: "Marketing Specialist",
            applicants: 67,
            interviews: 12,
            status: "Active",
            variant: "success",
        },
        {
            title: "Accountant",
            applicants: 52,
            interviews: 8,
            status: "Closed",
            variant: "secondary",
        },
        {
            title: "Senior Software Engineer",
            applicants: 45,
            interviews: 6,
            status: "Active",
            variant: "success",
        },
        {
            title: "HR Manager",
            applicants: 28,
            interviews: 4,
            status: "Active",
            variant: "success",
        },
    ];

    return (
        <Card>
            <div className="pb-2 mb-3 flex items-center justify-between">
                <div className="text-xl font-bold">Top Performing Jobs</div>
                <div className="text-blue-600 font-bold">
                   View All
                </div>
            </div>

            {jobs.map((job, index) => (
                <div key={index} className="py-2">
                    <div className="bg-gray-100 p-2 rounded-md">
                        <div className="font-medium mb-2">{job.title}</div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-gray-300 mt-2">
                                <div className="flex items-center gap-1 text-gray-500">
                                    <LuUsers className="w-4 h-5 text-gray-500" />
                                    <span>{job.applicants} applicants</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-500">
                                    <CalendarIcon className="w-4     h-5" />
                                    <span>{job.interviews} interviews</span>
                                </div>
                            </div>
                            <Badge
                                className="rounded-md"
                                label={job.status}
                                variant={job.variant}
                                showDot={false}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </Card>
    );
}
