import React, { useState } from "react";
import { Bell, Newspaper, TicketCheck, FileText, CalendarDays, Megaphone, ChevronRight } from "lucide-react";

const activities = [
    {
        title: "Company Achieves Major Milestone",
        source: "CEO Office",
        time: "2 hours ago",
        icon: Newspaper,
        gradient: "from-blue-500 to-indigo-600",
        shadow: "shadow-blue-200",
        sourceBg: "bg-blue-50",
        sourceText: "text-blue-600",
    },
    {
        title: "Your ticket #TKT-1045 was resolved",
        source: "IT Support",
        time: "4 hours ago",
        icon: TicketCheck,
        gradient: "from-rose-500 to-red-600",
        shadow: "shadow-red-200",
        sourceBg: "bg-red-50",
        sourceText: "text-red-500",
    },
    {
        title: "Application update for Senior Developer",
        source: "HR Team",
        time: "1 day ago",
        icon: FileText,
        gradient: "from-teal-400 to-emerald-500",
        shadow: "shadow-teal-200",
        sourceBg: "bg-teal-50",
        sourceText: "text-teal-600",
    },
    {
        title: "New event: Tech Innovation Showcase",
        source: "Events Team",
        time: "2 days ago",
        icon: CalendarDays,
        gradient: "from-yellow-400 to-orange-500",
        shadow: "shadow-yellow-200",
        sourceBg: "bg-yellow-50",
        sourceText: "text-yellow-600",
    },
    {
        title: "Q1 Performance Review Cycle Begins",
        source: "HR Central",
        time: "3 days ago",
        icon: Megaphone,
        gradient: "from-violet-500 to-purple-600",
        shadow: "shadow-purple-200",
        sourceBg: "bg-violet-50",
        sourceText: "text-violet-600",
    },
];

export default function RecentActivityCardSection() {
    const [hovered, setHovered] = useState(null);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Bell size={15} className="text-gray-600" />
                    </div>
                    <span className="text-sm font-bold text-gray-800">Recent Activity</span>
                </div>
                <button className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors">
                    View All
                </button>
            </div>

            {/* Activity list */}
            <div className="flex flex-col gap-1 p-3">
                {activities.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={index}
                            onMouseEnter={() => setHovered(index)}
                            onMouseLeave={() => setHovered(null)}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                hovered === index ? "bg-gray-50 scale-[1.01]" : "bg-white"
                            }`}
                        >
                            {/* Gradient icon bubble */}
                            <div
                                className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-md ${item.shadow}`}
                            >
                                <Icon size={16} className="text-white" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate leading-snug">
                                    {item.title}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${item.sourceBg} ${item.sourceText}`}>
                                        {item.source}
                                    </span>
                                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                                    <span className="text-xs text-gray-400">{item.time}</span>
                                </div>
                            </div>

                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${hovered === index ? "bg-gray-200" : "bg-gray-100"}`}>
                                <ChevronRight size={13} className="text-gray-500" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
