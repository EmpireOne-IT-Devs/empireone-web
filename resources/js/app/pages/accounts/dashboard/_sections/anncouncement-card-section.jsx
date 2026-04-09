import React from "react";
import { AlertCircle, Megaphone, Heart, ChevronRight } from "lucide-react";

const announcements = [
    {
        title: "Company-wide Town Hall Meeting",
        time: "2 hours from now",
        icon: <Megaphone size={18} className="text-red-500" />,
        bgColor: "bg-red-50",
    },
    {
        title: "Holiday Office Closure Schedule",
        time: "Tomorrow",
        icon: <AlertCircle size={18} className="text-red-400" />,
        bgColor: "bg-red-50",
    },
    {
        title: "New Health Insurance Benefits",
        time: "3 days",
        icon: <Heart size={18} className="text-yellow-500" />,
        bgColor: "bg-yellow-50",
    },
];

export default function AnnouncementCardSection() {
    return (
        <div className="bg-red-50/50 rounded-2xl border-l-4 border-red-400 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
                <AlertCircle size={18} className="text-red-500" />
                <span className="text-sm font-semibold text-gray-700">
                    Urgent Announcements
                </span>
            </div>
            <div className="flex flex-col gap-3">
                {announcements.map((item) => (
                    <div
                        key={item.title}
                        className="flex items-center justify-between bg-white/80 rounded-xl px-4 py-3 hover:shadow-sm transition cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-10 h-10 flex items-center justify-center rounded-full ${item.bgColor}`}
                            >
                                {item.icon}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">
                                    {item.title}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {item.time}
                                </p>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-300" />
                    </div>
                ))}
            </div>
            <div className="text-center mt-4">
                <button className="text-sm font-medium text-blue-600 hover:underline">
                    View All Announcements →
                </button>
            </div>
        </div>
    );
}
