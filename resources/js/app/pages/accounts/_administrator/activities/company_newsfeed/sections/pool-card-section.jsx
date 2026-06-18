import React, { useState } from "react";
import { Heart, MessageSquare } from "lucide-react";
import { BarChart2 } from "lucide-react";
import Card from "@/app/_components/card";
import Badge from "@/app/_components/badge";

export default function PoolCardSection() {
    // Interactive state for tracking selection option clicks
    const [selectedOption, setSelectedOption] = useState(null);

    const pollData = {
        department: "HR Department",
        date: "Dec 21, 2024",
        badgeLabel: "Poll",
        badgeVariant: "purple", // Uses your purple definition from the Badge component
        question: "What should be our next team building activity?",
        subtext:
            "Help us decide the next team building event! Vote for your preferred activity.",
        options: [
            { id: "beach", label: "Beach Resort Weekend" },
            { id: "escape", label: "Escape Room Challenge" },
            { id: "cooking", label: "Cooking Class" },
            { id: "sports", label: "Sports Tournament" },
        ],
        engagement: {
            likes: 45,
            comments: 0,
            totalVotes: 118,
        },
    };

    return (
        <div className="w-full bg-[#f4f6f9] p-6 rounded-2xl font-sans antialiased">
            {/* Section Header */}
           
        <Card
            variant="default"
            padding="p-6"
            className="w-full col-span-1 bg-white border border-gray-100 shadow-sm"
        >
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    {/* Dark Blue Circular Icon Avatar */}
                    <div className="w-10 h-10 rounded-full bg-[#0b2265] flex items-center justify-center text-white shrink-0 shadow-sm">
                        <BarChart2 size={18} className="transform rotate-90" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800 leading-tight">
                            {pollData.department}
                        </span>
                        <span className="text-xs text-gray-400 mt-0.5">
                            {pollData.date}
                        </span>
                    </div>
                </div>

                {/* Custom Badge Component */}
                <Badge
                    label={pollData.badgeLabel}
                    variant={pollData.badgeVariant}
                    className="px-3 py-1 font-medium bg-purple-100 text-purple-600 rounded-full text-xs"
                />
            </div>

            {/* Poll Questions and Subtext content block */}
            <div className="mb-5">
                <h3 className="text-base font-semibold text-gray-900 tracking-tight mb-2">
                    {pollData.question}
                </h3>
                <p className="text-sm text-gray-500 font-normal leading-relaxed">
                    {pollData.subtext}
                </p>
            </div>

            {/* Poll Option Selection List Container */}
            <div className="flex flex-col gap-3 mb-6">
                {pollData.options.map((option) => {
                    const isCurrent = selectedOption === option.id;
                    return (
                        <div
                            key={option.id}
                            onClick={() => setSelectedOption(option.id)}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer text-sm font-medium ${
                                isCurrent
                                    ? "border-blue-500 bg-blue-50/30 text-blue-600 shadow-sm"
                                    : "border-gray-200 hover:border-gray-300 text-gray-700 bg-white"
                            }`}
                        >
                            {option.label}
                        </div>
                    );
                })}
            </div>

            {/* Bottom Actions and Total Counting Footer */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-semibold text-gray-400">
                {/* Social Interaction Buttons */}
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                        <Heart size={15} className="stroke-[2.5]" />
                        <span>{pollData.engagement.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                        <MessageSquare size={15} className="stroke-[2.5]" />
                        <span>{pollData.engagement.comments}</span>
                    </button>
                </div>

                {/* Vote Counter String */}
                <div className="text-gray-400 font-medium">
                    {pollData.engagement.totalVotes} total votes
                </div>
            </div>
        </Card>
        </div>
    );
}
