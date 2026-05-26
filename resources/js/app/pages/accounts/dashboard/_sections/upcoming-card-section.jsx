import React, { useState } from "react";
import { CalendarDays, MapPin, Clock, ChevronRight } from "lucide-react";

const events = [
    {
        title: "Annual Holiday Party 2024",
        date: "Dec 22",
        time: "6:00 PM",
        location: "Grand Ballroom",
        gradient: "from-blue-500 to-indigo-600",
        lightBg: "bg-blue-50",
        textColor: "text-blue-600",
        month: "DEC",
        day: "22",
    },
    {
        title: "Leadership Summit 2025",
        date: "Jan 5",
        time: "9:00 AM",
        location: "Conference Center",
        gradient: "from-yellow-400 to-orange-500",
        lightBg: "bg-yellow-50",
        textColor: "text-yellow-600",
        month: "JAN",
        day: "5",
    },
    {
        title: "Wellness Week: Yoga",
        date: "Jan 8",
        time: "7:00 AM",
        location: "Wellness Center",
        gradient: "from-green-400 to-emerald-500",
        lightBg: "bg-green-50",
        textColor: "text-green-600",
        month: "JAN",
        day: "8",
    },
];

export default function UpcomingCardSection() {
    const [hovered, setHovered] = useState(null);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                        <CalendarDays size={15} className="text-blue-600" />
                    </div>
                    <span className="text-sm font-bold text-gray-800">Upcoming Events</span>
                </div>
                <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                    {events.length} events
                </span>
            </div>

            {/* Events */}
            <div className="flex flex-col gap-2 p-3">
                {events.map((event, index) => (
                    <div
                        key={index}
                        onMouseEnter={() => setHovered(index)}
                        onMouseLeave={() => setHovered(null)}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                            hovered === index ? "bg-gray-50 scale-[1.01]" : "bg-white"
                        }`}
                    >
                        {/* Date badge */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${event.gradient} flex flex-col items-center justify-center shadow-sm`}>
                            <span className="text-[9px] font-bold text-white/80 uppercase tracking-widest leading-none">
                                {event.month}
                            </span>
                            <span className="text-lg font-black text-white leading-tight">
                                {event.day}
                            </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate leading-snug">
                                {event.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                    <Clock size={11} className="text-gray-400" />
                                    <span className="text-xs text-gray-400">{event.time}</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-gray-300" />
                                <div className="flex items-center gap-1">
                                    <MapPin size={11} className="text-gray-400" />
                                    <span className="text-xs text-gray-400 truncate">{event.location}</span>
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
            <div className="mx-3 mb-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-orange-600 text-center cursor-pointer hover:opacity-90 transition-opacity shadow-sm shadow-blue-200">
                <button className="text-xs font-bold text-white tracking-wide">
                    View Full Calendar →
                </button>
            </div>
        </div>
    );
}
