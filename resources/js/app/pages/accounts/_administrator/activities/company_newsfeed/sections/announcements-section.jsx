import React from "react";
import { TbSpeakerphone } from "react-icons/tb";

// Custom Mock Data to match the screenshot content exactly
const announcementsData = [
    {
        id: 1,
        title: "Company-wide Town Hall Meeting",
        description:
            "Join us for our quarterly town hall meeting where leadership will share updates on company performance.",
        date: "Dec 25, 2024 at 10:00 AM",
        tag: "Meeting",
        priority: "High Priority",
        priorityLevel: "high",
    },
    {
        id: 2,
        title: "New Health Insurance Benefits Available",
        description:
            "Exciting new health insurance options are now available with enhanced coverage and lower premiums.",
        date: "Dec 23, 2024",
        tag: "Benefits",
        priority: "Medium Priority",
        priorityLevel: "medium",
    },
    {
        id: 3,
        title: "Holiday Office Closure Schedule",
        description:
            "Our offices will be closed for the holiday season. Emergency contacts have been distributed to all teams.",
        date: "Dec 24-26, 2024",
        tag: "Holiday",
        priority: "High Priority",
        priorityLevel: "high",
    },
    {
        id: 4,
        title: "Holiday Office Closure Schedule",
        description:
            "Our offices will be closed for the holiday season. Emergency contacts have been distributed to all teams.",
        date: "Dec 24-26, 2024",
        tag: "Holiday",
        priority: "High Priority",
        priorityLevel: "high",
    },
];

export default function AnnouncementsSection() {
    return (
        <div className="w-full bg-[#f4f6f9] p-6 rounded-2xl font-sans antialiased">
            {/* Header section with the custom blue color title */}
            <div className="flex items-center gap-2 mb-5">
                <TbSpeakerphone className="text-[#001845]" size={22} />
                <h2 className="text-lg font-bold text-[#001845] tracking-tight">
                    Important Announcements
                </h2>
            </div>

            {/* Responsive grid matching layout pattern */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                {announcementsData.map((announcement) => (
                    <div
                        key={announcement.id}
                        className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[140px] relative overflow-hidden"
                    >
                        {/* Top Metadata Row */}
                        <div className="flex items-start justify-between gap-4 mb-2">
                            {/* Dot indicator + Title */}
                            <div className="flex items-center gap-2.5">
                                <span
                                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                        announcement.priorityLevel === "high"
                                            ? "bg-[#ff4d4f]"
                                            : "bg-[#ffc107]"
                                    }`}
                                />
                                <h3 className="text-[15px] font-semibold text-gray-800 leading-tight">
                                    {announcement.title}
                                </h3>
                            </div>

                            {/* Priority Indicator Badge */}
                            <span
                                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md whitespace-nowrap ${
                                    announcement.priorityLevel === "high"
                                        ? "bg-[#fff1f0] text-[#ff4d4f]"
                                        : "bg-[#fffbe6] text-[#faad14]"
                                }`}
                            >
                                {announcement.priority}
                            </span>
                        </div>

                        {/* Middle Content Description */}
                        <p className="text-xs text-gray-500 leading-relaxed font-normal mb-4">
                            {announcement.description}
                        </p>

                        {/* Bottom Footer Tags/Dates */}
                        <div className="flex items-center gap-3 text-[11px] text-gray-400">
                            <span>{announcement.date}</span>
                            <span className="bg-[#f0f2f5] text-gray-500 px-2 py-0.5 rounded font-normal">
                                {announcement.tag}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
