import React, { useEffect } from "react";
import { Heart, MessageSquare } from "lucide-react";
import { LuSparkles } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";

import Card from "@/app/_components/card";
import Badge from "@/app/_components/badge";
import { get_engagement_posts_thunk } from "@/app/redux/engagement-slice";

const FALLBACK_IMAGE = "/images/building.jpg";

// Categories that have their own dedicated sections — exclude them here
const EXCLUDED_CATEGORIES = ["News", "Milestone"];

function stripHtml(html) {
    return html ? html.replace(/<[^>]+>/g, "").trim() : "";
}

function formatDate(d) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function RecentActivitySection() {
    const dispatch = useDispatch();
    const { posts, postsLoading } = useSelector((s) => s.engagement);

    useEffect(() => {
        dispatch(get_engagement_posts_thunk());
    }, [dispatch]);

    // Show the most recently published non-news, non-milestone, non-poll post.
    // Fall back to the latest post of any type if nothing else is available.
    const activityPosts = posts.filter(
        (p) => p.type !== "poll" && !EXCLUDED_CATEGORIES.includes(p.category),
    );
    const activityItem = activityPosts[0] ?? null;

    const authorName = activityItem?.author?.name ?? "";
    const authorInitial = authorName ? authorName[0].toUpperCase() : "A";

    return (
        <div className="w-full bg-[#f4f6f9] p-6 rounded-2xl font-sans antialiased">
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-5">
                <LuSparkles className="text-[#001845]" size={22} />
                <h2 className="text-lg font-bold text-[#001845] tracking-tight">
                    Recent Activities & Polls
                </h2>
            </div>

            {/* Loading skeleton */}
            {postsLoading && !activityItem ? (
                <div className="h-64 rounded-2xl bg-white animate-pulse" />
            ) : !activityItem ? (
                <Card variant="default" padding="p-6" className="border border-gray-100">
                    <p className="text-sm text-gray-400 text-center py-8">
                        No recent activity yet.
                    </p>
                </Card>
            ) : (
                /* Main Activity Card */
                <Card
                    variant="default"
                    padding="p-0"
                    className="overflow-hidden border border-gray-100"
                >
                    {/* Hero Image Block */}
                    <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
                        <img
                            src={activityItem.media_url ?? FALLBACK_IMAGE}
                            alt={activityItem.headline}
                            className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute top-4 left-4">
                            <Badge
                                label={activityItem.category ?? "General"}
                                variant="primary"
                                outlined={true}
                                className="bg-white/95 backdrop-blur-sm border-none shadow-sm text-blue-600 px-3 py-1.5 rounded-full"
                            />
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6">
                        <h3 className="text-[15px] font-semibold text-gray-800 tracking-tight mb-2">
                            {activityItem.headline}
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed font-normal mb-6 line-clamp-2">
                            {stripHtml(activityItem.message)}
                        </p>

                        <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center text-white font-medium text-sm shrink-0 shadow-sm">
                                    {authorInitial}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold text-gray-700 leading-none mb-1">
                                        {authorName || "Admin"}
                                    </span>
                                    <span className="text-[11px] text-gray-400">
                                        {formatDate(activityItem.published_at)}
                                    </span>
                                </div>
                            </div>

                            {/* Social Interaction Counters */}
                            <div className="flex items-center gap-3 text-xs font-medium">
                                <div className="flex items-center gap-1.5 text-red-500 bg-red-50/20 px-1 py-0.5 rounded">
                                    <Heart
                                        size={14}
                                        className="fill-current text-red-500"
                                    />
                                    <span>{activityItem.reaction_count ?? 0}</span>
                                </div>

                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <MessageSquare
                                        size={14}
                                        className="stroke-[2.5]"
                                    />
                                    <span>{activityItem.comment_count ?? 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
