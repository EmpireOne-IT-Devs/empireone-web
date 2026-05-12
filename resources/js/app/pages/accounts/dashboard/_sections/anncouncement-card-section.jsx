import React, { useState } from "react";
import { Megaphone, Heart, AlertTriangle, ChevronRight, Sparkles } from "lucide-react";

const announcements = [
    {
        title: "Company-wide Town Hall Meeting",
        time: "2 hours from now",
        icon: <Megaphone size={15} className="text-white" />,
        gradient: "from-red-500 to-rose-600",
        glow: "shadow-red-200",
        tag: "Urgent",
        tagColor: "bg-red-50 text-red-600 ring-1 ring-red-200",
        dot: "bg-red-500",
    },
    {
        title: "Holiday Office Closure Schedule",
        time: "Tomorrow",
        icon: <AlertTriangle size={15} className="text-white" />,
        gradient: "from-orange-400 to-amber-500",
        glow: "shadow-orange-200",
        tag: "Notice",
        tagColor: "bg-orange-50 text-orange-600 ring-1 ring-orange-200",
        dot: "bg-orange-500",
    },
    {
        title: "New Health Insurance Benefits",
        time: "3 days",
        icon: <Heart size={15} className="text-white" />,
        gradient: "from-yellow-400 to-yellow-500",
        glow: "shadow-yellow-200",
        tag: "Info",
        tagColor: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200",
        dot: "bg-yellow-400",
    },
];

export default function AnnouncementCardSection() {
    const [hovered, setHovered] = useState(null);

    return (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="relative px-5 pt-5 pb-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-purple-500 to-blue-400 opacity-100" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Sparkles size={15} className="text-white" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm tracking-wide">Announcements</p>
                            <p className="text-white/70 text-xs">{announcements.length} active alerts</p>
                        </div>
                    </div>
                    <span className="text-xs font-bold bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full border border-white/30">
                        New
                    </span>
                </div>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-2 p-3">
                {announcements.map((item, index) => (
                    <div
                        key={index}
                        onMouseEnter={() => setHovered(index)}
                        onMouseLeave={() => setHovered(null)}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                            hovered === index ? "bg-gray-50 scale-[1.01]" : "bg-white"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-md ${item.glow} flex-shrink-0`}>
                                {item.icon}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800 leading-snug">
                                    {item.title}
                                </p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.tagColor}`}>
                                        {item.tag}
                                    </span>
                                    <div className={`w-1 h-1 rounded-full ${item.dot}`} />
                                    <span className="text-xs text-gray-400">{item.time}</span>
                                </div>
                            </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${hovered === index ? "bg-gray-200" : "bg-gray-100"}`}>
                            <ChevronRight size={13} className="text-gray-500" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mx-3 mb-5 py-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-100 text-center">
                <button className="text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors">
                    View all announcements →
                </button>
            </div>
        </div>
    );
}
