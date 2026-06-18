import React from "react";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import Card from "@/app/_components/card";
import Badge from "@/app/_components/badge";

export default function EventCardSection() {
    // Array structure mirroring the 3 specific cards in the uploaded image
    const eventsData = [
        {
            id: 1,
            title: "Annual Holiday Party 2024",
            description:
                "Join us for an evening of celebration, networking, and entertainment. Dinner and drinks included!",
            date: "Dec 22, 2024",
            time: "6:00 PM - 10:00 PM",
            location: "Grand Ballroom",
            attendees: "156 attending",
            category: "Team Building",
            image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80", // Festival/party themed placeholder
        },
        {
            id: 2,
            title: "Leadership Summit 2025",
            description:
                "Strategic planning and leadership development workshop for all department heads.",
            date: "Jan 5, 2025",
            time: "9:00 AM - 5:00 PM",
            location: "Conference Center",
            attendees: "42 attending",
            category: "Town Hall",
            image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80", // Presentation/summit themed placeholder
        },
        {
            id: 3,
            title: "Wellness Week: Yoga & Meditation",
            description:
                "Daily yoga and meditation sessions to promote employee wellness. All levels welcome.",
            date: "Jan 8-12, 2025",
            time: "7:00 AM - 8:00 AM",
            location: "Wellness Center",
            attendees: "67 attending",
            category: "Wellness",
            image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80", // Yoga/Sunset themed placeholder
        },
    ];

    return (
        <div className="w-full bg-[#f4f6f9] p-6 rounded-2xl font-sans antialiased">
            {/* Main Responsive Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {eventsData.map((event) => (
                    <Card
                        key={event.id}
                        variant="default"
                        padding="p-0"
                        className="overflow-hidden border border-gray-100 bg-white flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                        {/* Top Hero Banner with Dark Visual Gradient Protection Overlay */}
                        <div className="relative w-full h-44 bg-slate-900 overflow-hidden shrink-0">
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover object-center"
                            />
                            {/* Linear Gradient protection to make white text completely legible */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                            {/* Category Float Badge */}
                            <div className="absolute top-3 left-3">
                                <Badge
                                    label={event.category}
                                    variant="primary"
                                    className="text-[10px] bg-[#0b2265]/90 backdrop-blur-sm border-none text-white px-2 py-0.5 font-medium tracking-wide normal-case rounded"
                                />
                            </div>

                            {/* Title & Timing Content Overlaid on Image Bottom */}
                            <div className="absolute bottom-3 left-4 right-4 text-white">
                                <h3 className="text-sm font-semibold tracking-tight leading-snug mb-1.5">
                                    {event.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-white/85 font-medium">
                                    <div className="flex items-center gap-1">
                                        <Calendar
                                            size={11}
                                            className="text-white/80"
                                        />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock
                                            size={11}
                                            className="text-white/80"
                                        />
                                        <span>{event.time}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Description & Location Footer Body */}
                        <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                            <p className="text-xs text-gray-500 font-normal leading-relaxed mb-4">
                                {event.description}
                            </p>

                            {/* Location & Attendance Counters Row */}
                            <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 border-t border-gray-50 pt-3 mt-auto">
                                <div className="flex items-center gap-1">
                                    <MapPin
                                        size={13}
                                        className="text-gray-400"
                                    />
                                    <span className="truncate max-w-[140px] md:max-w-[180px]">
                                        {event.location}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-blue-600 font-semibold shrink-0">
                                    <Users size={13} />
                                    <span>{event.attendees}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
