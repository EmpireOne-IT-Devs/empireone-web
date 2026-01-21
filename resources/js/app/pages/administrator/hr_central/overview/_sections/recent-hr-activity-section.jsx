import Card from "@/app/_components/card";
import React from "react";

export default function RecentHrActivitySection() {
    const activities = [
        {
            name: "Sarah Johnson",
            role: "Senior Developer",
            status: "Onboarding",
            statusColor: "teal",
            date: "2024-12-20",
            iconBg: "bg-teal-500",
            iconType: "user",
        },
        {
            name: "Michael Chen",
            role: "Vacation Leave",
            status: "Approved",
            statusColor: "green",
            date: "2024-12-19",
            iconBg: "bg-orange-500",
            iconType: "calendar",
        },
        {
            name: "Emma Davis",
            role: "Q4 Performance Review",
            status: "Completed",
            statusColor: "teal",
            date: "2024-12-18",
            iconBg: "bg-purple-500",
            iconType: "chart",
        },
        {
            name: "James Wilson",
            role: "Marketing Manager",
            status: "Exit Interview",
            statusColor: "orange",
            date: "2024-12-17",
            iconBg: "bg-red-500",
            iconType: "user",
        },
    ];

    const getStatusStyles = (color) => {
        const styles = {
            teal: "bg-teal-50 text-teal-700",
            green: "bg-green-50 text-green-700",
            orange: "bg-orange-50 text-orange-700",
        };
        return styles[color] || styles.teal;
    };

    const renderIcon = (type, bgClass) => {
        return (
            <div
                className={`${bgClass} w-10 h-10 rounded-full flex items-center justify-center`}
            >
                {type === "user" && (
                    <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                )}
                {type === "calendar" && (
                    <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                )}
                {type === "chart" && (
                    <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                    </svg>
                )}
            </div>
        );
    };

    return (
        <Card className="gap-3">
            <div className="pb-2 mb-3">
                <div className="text-xl font-bold border-b pb-3">
                    Recent HR Activities
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {activities.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between py-2 bg-gray-50 px-4 rounded-lg"
                    >
                        <div className="flex items-center gap-3">
                            {renderIcon(item.iconType, item.iconBg)}
                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    {item.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {item.role}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(
                                    item.statusColor
                                )}`}
                            >
                                {item.status}
                            </span>
                            <span className="text-sm text-gray-500 min-w-[90px] text-right">
                                {item.date}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
