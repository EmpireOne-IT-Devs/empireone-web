import { Calendar } from "lucide-react";
import React from "react";

export default function HeaderSection() {
    return (
        <div className="w-full bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#f59e0b] rounded-2xl p-6 md:p-7 shadow-sm text-white font-sans antialiased mb-4">
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2.5 text-[21px] font-bold tracking-tight">
                    <Calendar className="shrink-0 stroke-[2.2]" size={24} />
                    <h2>Event Feedback</h2>
                </div>

                <p className="text-xs md:text-sm text-white/90 font-normal leading-relaxed tracking-normal max-w-2xl">
                    Share your experience and help us improve future events.
                </p>
            </div>
        </div>
    );
}