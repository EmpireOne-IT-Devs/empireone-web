import React from "react";
import { BarChart3 } from "lucide-react";

export default function HeaderSection() {
    return (
       <div className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 md:p-7 text-white shadow-sm mb-4">
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2.5 text-[21px] font-bold tracking-tight">
                    <BarChart3 className="shrink-0" size={24} />
                    <h2>Poll Analytics</h2>
                </div>

                <p className="max-w-2xl text-xs md:text-sm text-white/90 font-normal leading-relaxed">
                    Monitor poll participation, analyze voting trends, and gain
                    insights from employee responses across all polls.
                </p>
            </div>
        </div>
    );
}
