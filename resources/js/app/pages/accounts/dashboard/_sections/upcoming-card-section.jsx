import React from "react";
import { CalendarDays } from "lucide-react";

const events = [
    {
        title: "Annual Holiday Party 2024",
        date: "Dec 22",
        time: "6:00 PM",
        location: "Grand Ballroom",
        borderColor: "border-blue-600",
    },
    {
        title: "Leadership Summit 2025",
        date: "Jan 5",
        time: "9:00 AM",
        location: "Conference Center",
        borderColor: "border-yellow-500",
    },
    {
        title: "Wellness Week: Yoga",
        date: "Jan 8",
        time: "7:00 AM",
        location: "Wellness Center",
        borderColor: "border-green-500",
    },
];

export default function UpcomingCardSection() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-5">
                <CalendarDays size={20} className="text-gray-600" />
                <span className="text-lg font-bold text-gray-800">
                    Upcoming Events
                </span>
            </div>
            <div className="flex flex-col gap-4">
                {events.map((event) => (
                    <div
                        key={event.title}
                        className={`border-l-4 ${event.borderColor} pl-4 py-1`}
                    >
                        <p className="text-sm font-semibold text-gray-800">
                            {event.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-blue-600 mt-1">
                            <CalendarDays size={12} />
                            <span>{event.date}</span>
                            <span className="text-gray-400">
                                {event.time}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {event.location}
                        </p>
                    </div>
                ))}
            </div>
            <button className="w-full mt-5 py-2.5 text-sm font-semibold text-blue-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                View Calendar
            </button>
        </div>
    );
}
