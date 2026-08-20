import React, { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, Users, BarChart2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/app/_components/card";
import Badge from "@/app/_components/badge";
import { get_engagement_posts_thunk } from "@/app/redux/engagement-thunk";
import PostCardModalSection from "../../home/sections/post-card-modal-section";

const FALLBACK_IMAGE = "/images/building.jpg";

function stripHtml(html) { return html ? html.replace(/<[^>]+>/g, "").trim() : ""; }
function formatDate(d) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function parsePollMessage(message) {
    if (!message) return { question: "" };
    return { question: message.replace(/<[^>]+>/g, "").trim() };
}

function EventCard({ post, onClick }) {
    const title = post.title ?? post.headline;
    const body  = post.content ?? post.message;
    const image = post.files?.[0]?.url ?? post.media_url ?? FALLBACK_IMAGE;

    return (
        <Card
            variant="default"
            padding="p-0"
            className="overflow-hidden border border-gray-100 bg-white flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={onClick}
        >
            <div className="relative w-full h-44 bg-slate-900 overflow-hidden shrink-0">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute top-3 left-3">
                    <Badge
                        label="Event"
                        variant="primary"
                        className="text-[10px] bg-[#0b2265]/90 backdrop-blur-sm border-none text-white px-2 py-0.5 font-medium tracking-wide normal-case rounded"
                    />
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-sm font-semibold tracking-tight leading-snug mb-1.5">
                        {title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-white/85 font-medium">
                        <div className="flex items-center gap-1">
                            <Calendar size={11} className="text-white/80" />
                            <span>{formatDate(post.published_at)}</span>
                        </div>
                        {post.scheduled_at && (
                            <div className="flex items-center gap-1">
                                <Clock size={11} className="text-white/80" />
                                <span>{new Date(post.scheduled_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                <p className="text-xs text-gray-500 font-normal leading-relaxed mb-4">
                    {stripHtml(body).substring(0, 150)}
                </p>
                {/* <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 border-t border-gray-50 pt-3 mt-auto">
                    <div className="flex items-center gap-1">
                        <MapPin size={13} className="text-gray-400" />
                        <span className="truncate max-w-[140px] md:max-w-[180px]">
                            {post.publish_to}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 font-semibold shrink-0">
                        <Users size={13} />
                        <span>{post.publish_to}</span>
                    </div>
                </div> */}
            </div>
        </Card>
    );
}

function PollCard({ post, onClick }) {
    const { question } = parsePollMessage(post.message);
    const options = post.options ?? [];
    const totalVotes = post.total_votes ?? 0;
    return (
        <Card
            variant="default"
            padding="p-0"
            className="overflow-hidden border border-gray-100 bg-white flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={onClick}
        >
            <div className="relative w-full h-14 bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center px-4 shrink-0">
                <BarChart2 size={18} className="text-white/80 rotate-90 mr-2 shrink-0" />
                <span className="text-white font-semibold text-sm truncate">{post.headline}</span>
                <div className="absolute top-3 right-3">
                    <Badge label="Poll" variant="purple" />
                </div>
            </div>
            <div className="p-4 flex-1 flex flex-col gap-2">
                {question && (
                    <p className="text-sm font-medium text-gray-800">{question}</p>
                )}
                <div className="flex flex-col gap-1.5 mt-1">
                    {options.slice(0, 3).map((opt) => (
                        <div key={opt.id} className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                            {opt.label}
                        </div>
                    ))}
                    {options.length > 3 && (
                        <p className="text-xs text-gray-400 pl-1">+{options.length - 3} more options</p>
                    )}
                </div>
            </div>
            <div className="px-4 pb-4 text-[11px] text-gray-400 flex items-center justify-between border-t border-gray-50 pt-3">
                <div className="flex items-center gap-1">
                    <Calendar size={11} />
                    <span>{formatDate(post.published_at)}</span>
                </div>
                {totalVotes > 0 && (
                    <span>{totalVotes} {totalVotes === 1 ? "vote" : "votes"}</span>
                )}
            </div>
        </Card>
    );
}

export default function EngagementCardSection({ onCardClick }) {
    const dispatch = useDispatch();
    const { posts, postsLoading } = useSelector((s) => s.engagement);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => { 
        dispatch(get_engagement_posts_thunk()); 
    }, [dispatch]);

    const items = posts.filter(
        (p) => p.category === "Event" || p.type === "poll",
    );

    return (
        <div className="w-full bg-[#f4f6f9] p-6 rounded-2xl font-sans antialiased">
            {postsLoading && items.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-64 rounded-2xl bg-white animate-pulse" />
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="flex items-center justify-center py-16 text-sm text-gray-400">
                    No events or polls published yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {items.map((item) =>
                        item.type === "poll" ? (
                            <PollCard
                                key={item.id}
                                post={item}
                                onClick={() =>
                                    onCardClick ? onCardClick(item) : setSelectedPost(item)
                                }
                            />
                        ) : (
                            <EventCard
                                key={item.id}
                                post={item}
                                onClick={() =>
                                    onCardClick ? onCardClick(item) : setSelectedPost(item)
                                }
                            />
                        ),
                    )}
                </div>
            )}

            <PostCardModalSection
                post={selectedPost}
                onClose={() => setSelectedPost(null)}
            />
        </div>
    );
}