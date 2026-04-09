import React from "react";
import { Bell, Newspaper, TicketCheck, FileText, CalendarDays, Megaphone } from "lucide-react";

const activities = [
    {
        title: "Company Achieves Major Milestone",
        source: "CEO Office",
        time: "2 hours ago",
        icon: <Newspaper size={18} className="text-blue-600" />,
        bgColor: "bg-blue-50",
    },
    {
        title: "Your ticket #TKT-1045 was resolved",
        source: "IT Support",
        time: "4 hours ago",
        icon: <TicketCheck size={18} className="text-red-500" />,
        bgColor: "bg-red-50",
    },
    {
        title: "Application update for Senior Developer",
        source: "HR Team",
        time: "1 day ago",
        icon: <FileText size={18} className="text-teal-600" />,
        bgColor: "bg-teal-50",
    },
    {
        title: "New event: Tech Innovation Showcase",
        source: "Events Team",
        time: "2 days ago",
        icon: <CalendarDays size={18} className="text-yellow-600" />,
        bgColor: "bg-yellow-50",
    },
    {
        title: "Q1 Performance Review Cycle Begins",
        source: "HR Central",
        time: "3 days ago",
        icon: <Megaphone size={18} className="text-blue-500" />,
        bgColor: "bg-blue-50",
    },
];

export default function RecentActivityCardSection() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <Bell size={20} className="text-gray-600" />
                    <span className="text-lg font-bold text-gray-800">
                        Recent Activity
                    </span>
                </div>
                <button className="text-sm font-semibold text-blue-600 hover:underline">
                    View All
                </button>
            </div>
            <div className="flex flex-col gap-5">
                {activities.map((item) => (
                    <div key={item.title} className="flex items-center gap-4">
                        <div
                            className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full ${item.bgColor}`}
                        >
                            {item.icon}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">
                                {item.title}
                            </p>
                            <p className="text-xs text-blue-500">
                                {item.source}
                                <span className="text-gray-400"> • {item.time}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
