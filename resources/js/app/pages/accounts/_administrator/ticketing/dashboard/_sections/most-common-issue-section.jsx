import Badge from "@/app/_components/badge";
import Card from "@/app/_components/card";
import React from "react";

export default function MostCommonIssueSection() {
    const issues = [
        {
            title: "Password Reset Request",
            count: 342,
            percentage: 28,
            category: "Account Access",
            avgResolution: "15 min",
            progress: 70,
            progressColor: "bg-blue-600",
        },
        {
            title: "Software Installation",
            count: 256,
            percentage: 21,
            category: "IT Support",
            avgResolution: "45 min",
            progress: 40,
            progressColor: "bg-purple-600",
        },
        {
            title: "Hardware Issues",
            count: 198,
            percentage: 16,
            category: "Technical",
            avgResolution: "2 hours",
            progress: 80,
            progressColor: "bg-green-600",
        },
    ];

    return (
        <Card className="flex-1 flex flex-col gap-3">
            <div className="border-b-2 border-gray-200 pb-3 mb-1 flex items-center justify-between">
                <div className="text-xl font-bold text-gray-800">
                    Most Common Issues
                </div>
                <div className="text-sm text-gray-500 font-medium">
                    Last 30 Days
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {issues.map((issue, index) => (
                    <div
                        key={index}
                        className="py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-gray-800">
                                {issue.title}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-lg text-gray-900">
                                    {issue.count}
                                </span>
                                <span className="text-sm text-gray-500">
                                    ({issue.percentage}%)
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{issue.category}</Badge>
                            <span className="text-sm text-gray-600">
                                Avg Resolution:{" "}
                                <span className="font-semibold">
                                    {issue.avgResolution}
                                </span>
                            </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                                className={`${issue.progressColor} h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm`}
                                style={{ width: `${issue.progress}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
