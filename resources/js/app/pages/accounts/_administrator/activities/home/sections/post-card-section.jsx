import React from "react";
import { Heart, MessageSquare, Share2, MoreHorizontal } from "lucide-react";
import Card from "@/app/_components/card";

const postsData = [
    {
        id: 1,
        author: "Sarah Jenkins",
        department: "Engineering Excellence",
        timeAgo: "2h ago",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        content: "Thrilled to announce that our team just deployed the new AI-driven resource allocator. Huge shoutout to everyone involved in the sprint! 🚀",
        hashtags: "#Engineering #Innovation",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
        likes: 24,
        comments: 8,
    },
    {
        id: 2,
        author: "Michael Chen",
        department: "Product Management",
        timeAgo: "4h ago",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        content: "Excited to share that we've reached a new milestone! Our Q2 product roadmap is now live. Check it out and share your feedback! 📈",
        hashtags: "#ProductLaunch #Milestone",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
        likes: 42,
        comments: 15,
    },
    {
        id: 3,
        author: "Emily Rodriguez",
        department: "Human Resources",
        timeAgo: "6h ago",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        content: "We're proud to announce our new diversity and inclusion initiatives for the upcoming quarter. Everyone's voice matters! 🌟",
        hashtags: "#DEI #Culture",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
        likes: 56,
        comments: 22,
    },
    {
        id: 4,
        author: "David Park",
        department: "Sales Team",
        timeAgo: "1d ago",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        content: "Just closed the biggest deal of the year! Couldn't have done it without the amazing support from our cross-functional teams. Thank you all! 🎉",
        hashtags: "#Sales #Teamwork",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
        likes: 78,
        comments: 31,
    },
    {
        id: 5,
        author: "Jessica Martinez",
        department: "Customer Success",
        timeAgo: "1d ago",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        content: "Our customer satisfaction score hit an all-time high this month! A huge thank you to the entire team for your dedication and hard work! 💪",
        hashtags: "#CustomerSuccess #Excellence",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800",
        likes: 91,
        comments: 28,
    },
];

function PostCard({ post }) {
    return (
        <div className="w-full">
            <Card
                variant="default"
                padding="p-5"
                className="w-full font-sans flex flex-col gap-4 cursor-default"
            >
                {/* Header Section */}
                <div className="flex justify-between items-start w-full">
                    <div className="flex items-center gap-3">
                        {/* Profile Avatar */}
                        <img
                            src={post.avatar}
                            alt={post.author}
                            className="w-11 h-11 rounded-full object-cover"
                        />
                        {/* User Info */}
                        <div>
                            <h3 className="font-semibold text-gray-900 text-[15px] leading-tight">
                                {post.author}
                            </h3>
                            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                                {post.department} <span className="mx-1 text-gray-400">•</span> {post.timeAgo}
                            </p>
                        </div>
                    </div>
                    
                    {/* Options Button */}
                    <button className="text-gray-400 hover:text-gray-600 transition p-1">
                        <MoreHorizontal size={20} />
                    </button>
                </div>

                {/* Post Text Content */}
                <div className="text-gray-800 text[15px] leading-relaxed">
                    <p>
                        {post.content}
                    </p>
                    <p className="mt-1 text-blue-600 font-medium hover:underline cursor-pointer">
                        {post.hashtags}
                    </p>
                </div>

                {/* Post Image Banner */}
                <div className="overflow-hidden rounded-xl border border-gray-100">
                    <img
                        src={post.image}
                        alt="Post image"
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
                            <span className="font-medium text-gray-600">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-blue-500 transition group">
                            <MessageSquare
                                size={18}
                                className="group-hover:scale-110 transition"
                            />
                            <span className="font-medium text-gray-600">{post.comments}</span>
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

export default function PostCardSection() {
    return (
        <div className="w-full flex flex-col gap-4">
            {postsData.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}