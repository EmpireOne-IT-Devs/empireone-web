import React from "react";
import { Heart, MessageSquare } from "lucide-react";
import { LuSparkles } from "react-icons/lu";

import Card from "@/app/_components/card";
import Badge from "@/app/_components/badge";
export default function RecentActivitySection() {
    const activityItem = {
        title: "Team Building Success: Marketing Department",
        description:
            "The marketing team concluded an amazing team-building retreat focused on collaboration.",
        category: "Marketing",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
        author: {
            name: "Sarah Johnson",
            initial: "S",
            date: "Dec 18, 2024",
        },
        engagement: {
            likes: 128,
            comments: 1,
        },
    };

    return (
        <div className="w-full bg-[#f4f6f9] p-6 rounded-2xl font-sans antialiased">
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-5">
                <LuSparkles className="text-[#001845]" size={22} />
                <h2 className="text-lg font-bold text-[#001845] tracking-tight">
                    Recent Activities & Polls
                </h2>
            </div>

            {/* Main Activity Card utilizing custom Card component */}
            <Card
                variant="default"
                padding="p-0"
                className="overflow-hidden border border-gray-100"
            >
                {/* Hero Image Block with custom Badge component floating inside */}
                <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
                    <img
                        src={activityItem.image}
                        alt={activityItem.title}
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute top-4 left-4">
                        <Badge
                            label={activityItem.category}
                            variant="primary"
                            outlined={true}
                            className="bg-white/95 backdrop-blur-sm border-none shadow-sm text-blue-600 px-3 py-1.5 rounded-full"
                        />
                    </div>
                </div>

                {/* Content Body Container */}
                <div className="p-6">
                    <h3 className="text-[15px] font-semibold text-gray-800 tracking-tight mb-2">
                        {activityItem.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-normal mb-6">
                        {activityItem.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                      
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center text-white font-medium text-sm shrink-0 shadow-sm">
                                {activityItem.author.initial}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-gray-700 leading-none mb-1">
                                    {activityItem.author.name}
                                </span>
                                <span className="text-[11px] text-gray-400">
                                    {activityItem.author.date}
                                </span>
                            </div>
                        </div>

                        {/* Social Interaction Counters */}
                        <div className="flex items-center gap-3 text-xs font-medium">
                            {/* Likes Counter */}
                            <div className="flex items-center gap-1.5 text-red-500 bg-red-50/20 px-1 py-0.5 rounded">
                                <Heart
                                    size={14}
                                    className="fill-current text-red-500"
                                />
                                <span>{activityItem.engagement.likes}</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-gray-400">
                                <MessageSquare
                                    size={14}
                                    className="stroke-[2.5]"
                                />
                                <span>{activityItem.engagement.comments}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
