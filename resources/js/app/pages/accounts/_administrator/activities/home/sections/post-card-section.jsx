import React from "react";
import { Heart, MessageSquare, Share2, MoreHorizontal } from "lucide-react";
import Card from "@/app/_components/card";

export default function PostCardSection() {
    return (
        <div className="flex justify-center items-center bg-gray-100 p-6 min-h-screen">
            <Card
                variant="default"
                padding="p-5"
                className="w-full max-w-2xl font-sans flex flex-col gap-4 cursor-default"
            >
                {/* Header Section */}
                <div className="flex justify-between items-start w-full">
                    <div className="flex items-center gap-3">
                        {/* Profile Avatar */}
                        <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                            alt="Sarah Jenkins"
                            className="w-11 h-11 rounded-full object-cover"
                        />
                        {/* User Info */}
                        <div>
                            <h3 className="font-semibold text-gray-900 text-[15px] leading-tight">
                                Sarah Jenkins
                            </h3>
                            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                                Engineering Excellence <span className="mx-1 text-gray-400">•</span> 2h ago
                            </p>
                        </div>
                    </div>
                    
                    {/* Options Button */}
                    <button className="text-gray-400 hover:text-gray-600 transition p-1">
                        <MoreHorizontal size={20} />
                    </button>
                </div>

                {/* Post Text Content */}
                <div className="text-gray-800 text-[15px] leading-relaxed">
                    <p>
                        Thrilled to announce that our team just deployed the new
                        AI-driven resource allocator. Huge shoutout to everyone
                        involved in the sprint! 🚀
                    </p>
                    <p className="mt-1 text-blue-600 font-medium hover:underline cursor-pointer">
                        #Engineering #Innovation
                    </p>
                </div>

                {/* Post Image Banner */}
                <div className="overflow-hidden rounded-xl border border-gray-100">
                    <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                        alt="Team celebrating deploy"
                        className="w-full h-auto max-h-[380px] object-cover"
                    />
                </div>

                {/* Footer Engagement Section */}
                <div className="flex justify-between items-center pt-3 text-gray-500 text-sm border-t border-gray-100 mt-1">
                    {/* Left Side: Likes and Comments */}
                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 hover:text-red-500 transition group">
                            <Heart
                                size={18}
                                className="group-hover:scale-110 transition"
                            />
                            <span className="font-medium text-gray-600">24</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-blue-500 transition group">
                            <MessageSquare
                                size={18}
                                className="group-hover:scale-110 transition"
                            />
                            <span className="font-medium text-gray-600">8</span>
                        </button>
                    </div>

                    {/* Right Side: Share */}
                    <button className="flex items-center gap-2 hover:text-green-600 transition group">
                        <Share2
                            size={18}
                            className="group-hover:scale-110 transition"
                        />
                        <span className="font-medium text-gray-600">Share</span>
                    </button>
                </div>
            </Card>
        </div>
    );
}