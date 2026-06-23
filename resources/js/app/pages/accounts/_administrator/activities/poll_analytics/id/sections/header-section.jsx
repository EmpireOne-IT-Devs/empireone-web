import React from "react";
import { BarChart3 } from "lucide-react";

export default function HeaderSection() {
    return (
        <div className="w-full p-6 md:p-7 text-gray-800 shadow-sm mb-4">
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2.5 text-[21px] font-bold tracking-tight">
                    <BarChart3 className="shrink-0" size={24} />
                    <h2>Poll Analytics Details</h2>
                </div>

                <p className="max-w-2xl text-xs md:text-sm text-gray-700 font-normal leading-relaxed">
                    View poll information, track participation rates, review
                    voting results, and analyze employee responses for this
                    poll.
                </p>
            </div>
        </div>
    );
}
