import React, { useEffect, useState } from "react";
import {
    Heart,
    MessageSquare,
    Share2,
    Megaphone,
    CalendarDays,
    Newspaper,
    Send,
    Tag,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/app/_components/card";
import Badge from "@/app/_components/badge";
import ActivityPollCard from "../../_components/activity-poll-card";
import {
    get_activity_posts_thunk,
    cast_poll_vote_thunk,
} from "@/app/redux/activities-thunk";
import PostActionMenu from "./post-action-menu";
import EditPostModal from "./edit-post-modal";
import { DeletePostSection } from "./delete-post-section";

// ── Category config ──────────────────────────────────────────────────────────
const CATEGORY_CONFIG = {
    "Pinned Announcement": { icon: Megaphone, variant: "danger" },
    Events: { icon: CalendarDays, variant: "primary" },
    News: { icon: Newspaper, variant: "info" },
    Milestone: { icon: Send, variant: "success" },
    General: { icon: Tag, variant: "secondary" },
};

function PostHtmlContent({ html, className = "" }) {
    return (
        <div
            className={`overflow-x-hidden break-words [&_*]:max-w-full [&_a]:break-all [&_a]:text-blue-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_b]:font-bold [&_em]:italic [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_i]:italic [&_img]:my-3 [&_img]:rounded-xl [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_strong]:font-bold [&_strong]:text-gray-800 [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-gray-200 [&_td]:p-2 [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:p-2 [&_ul]:list-disc [&_ul]:pl-5 ${className}`}
            dangerouslySetInnerHTML={{ __html: html ?? "" }}
        />
    );
}

function BirthdayPostCard({
    post,
    celebrants = [],
    menuOpen,
    onMenuToggle,
    onEdit,
    onDelete,
    deleting,
}) {
    return (
        <Card
            variant="default"
            padding="p-0"
            className="w-full overflow-hidden font-sans"
        >
            {/* Gradient banner */}
            <div className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 px-5 py-4 flex items-center gap-3">
                <span className="text-2xl">🎂</span>
                <div>
                    <p className="text-white font-bold text-sm leading-tight">
                        {post.headline}
                    </p>
                    <p className="text-white/70 text-[11px] font-mono tracking-widest mt-0.5">
                        {post.month} {post.year}
                    </p>
                </div>
            </div>

            <div className="px-5 py-4 flex flex-col gap-3   ">
                {/* Author row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        {post.author.avatar ? (
                            <img
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                                {post.author.initials}
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-semibold text-gray-900 leading-tight">
                                {post.author.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Activities • {post.time_ago}
                            </p>
                        </div>
                    </div>
                    <PostActionMenu
                        open={menuOpen}
                        onToggle={onMenuToggle}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        deleting={deleting}
                    />
                </div>

                <PostHtmlContent
                    html={post.message}
                    className="text-sm text-gray-700 leading-relaxed"
                />

                {celebrants.length > 0 && (
                    <div className="border border-purple-100 bg-purple-50/50 rounded-xl p-3.5 flex flex-col gap-2">
                        <p className="text-xs font-bold text-purple-500 uppercase tracking-wider">
                            🎂 Birthday Celebrant
                            {celebrants.length !== 1 ? "s" : ""} of the Month
                        </p>
                        <ul className="flex flex-col gap-1">
                            {celebrants.map((c) => (
                                <li
                                    key={c.user_id}
                                    className="flex items-center justify-between"
                                >
                                    <span className="text-sm text-gray-800 font-medium">
                                        {c.name}
                                    </span>
                                    {c.is_today && (
                                        <span className="text-[10px] font-bold bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">
                                            Today 🎂
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100 text-gray-500 text-xs">
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1.5 hover:text-red-500 transition group">
                            <Heart
                                size={14}
                                className="group-hover:scale-110 transition"
                            />
                            <span className="font-medium text-gray-600">0</span>
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-blue-500 transition group">
                            <MessageSquare
                                size={14}
                                className="group-hover:scale-110 transition"
                            />
                            <span className="font-medium text-gray-600">0</span>
                        </button>
                    </div>
                    <button className="flex items-center gap-1.5 hover:text-green-600 transition group">
                        <Share2
                            size={14}
                            className="group-hover:scale-110 transition"
                        />
                        <span className="font-medium text-gray-600">Share</span>
                    </button>
                </div>
            </div>
        </Card>
    );
}

function GeneralPostCard({
    post,
    menuOpen,
    onMenuToggle,
    onEdit,
    onDelete,
    deleting,
}) {
    const categoryKey = post.category ?? "General";
    const catConfig =
        CATEGORY_CONFIG[categoryKey] ?? CATEGORY_CONFIG["General"];

    return (
        <Card
            variant="default"
            padding="p-0"
            className="w-full overflow-hidden font-sans"
        >
            {/* Header */}
            <div className="px-4 pt-4 pb-3 flex justify-between items-start w-full">
                <div className="flex items-center gap-2.5">
                    {post.author.avatar ? (
                        <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-9 h-9 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-xs">
                            {post.author.initials}
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                            {post.author.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-xs text-gray-400">
                                Activities • {post.time_ago}
                            </p>
                            <span className="text-gray-300">·</span>
                            <Badge
                                label={categoryKey}
                                variant={catConfig.variant}
                                outlined
                                className="text-[10px] py-0"
                            />
                        </div>
                    </div>
                </div>
                <PostActionMenu
                    open={menuOpen}
                    onToggle={onMenuToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    deleting={deleting}
                />
            </div>

            {/* Text content */}
            <div className="px-4 pb-3 flex flex-col gap-1">
                <p className="font-semibold text-gray-900 text-sm">
                    {post.headline}
                </p>
                <PostHtmlContent
                    html={post.message}
                    className="text-gray-600 text-sm leading-relaxed"
                />
            </div>

            {/* Media */}
            {post.media_url &&
                (post.media_type === "video" ? (
                    <video
                        src={post.media_url}
                        controls
                        className="w-full max-h-[480px] object-contain bg-black"
                    />
                ) : (
                    <img
                        src={post.media_url}
                        alt={post.headline}
                        className="w-full max-h-[480px] object-cover"
                    />
                ))}

            {/* Footer */}
            <div className="px-4 py-3 flex justify-between items-center text-gray-500 text-xs border-t border-gray-100">
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 hover:text-red-500 transition group">
                        <Heart
                            size={14}
                            className="group-hover:scale-110 transition"
                        />
                        <span className="font-medium text-gray-600">0</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-blue-500 transition group">
                        <MessageSquare
                            size={14}
                            className="group-hover:scale-110 transition"
                        />
                        <span className="font-medium text-gray-600">0</span>
                    </button>
                </div>
                <button className="flex items-center gap-1.5 hover:text-green-600 transition group">
                    <Share2
                        size={14}
                        className="group-hover:scale-110 transition"
                    />
                    <span className="font-medium text-gray-600">Share</span>
                </button>
            </div>
        </Card>
    );
}

export default function PostCardSection() {
    const dispatch = useDispatch();
    const {
        posts,
        postsLoading,
        postsError,
        birthdays,
        birthdayMonth,
        postDeleting,
        pollVotingPostId,
    } = useSelector((state) => state.activities);

    const { handleDelete } = DeletePostSection();

    const [openMenuId, setOpenMenuId] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    useEffect(() => {
        dispatch(get_activity_posts_thunk());
    }, [dispatch]);

    function handleMenuToggle(id) {
        setOpenMenuId((prev) => (prev === id ? null : id));
    }

    function handleEdit(post) {
        setEditingPost(post);
    }

    function handleVote(postId, optionId) {
        dispatch(cast_poll_vote_thunk({ postId, optionId }));
    }

    if (postsLoading) {
        return (
            <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="w-full h-40 bg-gray-100 rounded-2xl animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (postsError) {
        return (
            <div className="flex items-center justify-center py-16 text-sm text-red-400">
                Failed to load posts. Please refresh and try again.
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="flex items-center justify-center py-16 text-sm text-gray-400">
                No posts yet. Publish a birthday post to get started!
            </div>
        );
    }

    return (
        <>
            <div className="w-full flex flex-col gap-4">
                {posts.filter((post) => !(post.type === "poll" && post.is_closed)).map((post) => {
                    if (post.type === "birthday") {
                        return (
                            <BirthdayPostCard
                                key={post.id}
                                post={post}
                                celebrants={
                                    post.month === birthdayMonth
                                        ? birthdays
                                        : []
                                }
                                menuOpen={openMenuId === post.id}
                                onMenuToggle={() => handleMenuToggle(post.id)}
                                onEdit={() => handleEdit(post)}
                                onDelete={() => handleDelete(post.id)}
                                deleting={postDeleting}
                            />
                        );
                    }

                    if (post.type === "poll") {
                        return (
                            <div
                                key={post.id}
                                className="w-full bg-[#f4f6f9] p-6 rounded-2xl font-sans antialiased"
                            >
                                <ActivityPollCard
                                    post={post}
                                    pollVoting={pollVotingPostId === post.id}
                                    onVote={(optionId) =>
                                        handleVote(post.id, optionId)
                                    }
                                    headerActions={
                                        <PostActionMenu
                                            open={openMenuId === post.id}
                                            onToggle={() =>
                                                handleMenuToggle(post.id)
                                            }
                                            onEdit={() => handleEdit(post)}
                                            onDelete={() =>
                                                handleDelete(post.id)
                                            }
                                            deleting={postDeleting}
                                        />
                                    }
                                    footerMeta={
                                        <span className="text-gray-400 font-medium">
                                            Activities • {post.time_ago}
                                        </span>
                                    }
                                />
                            </div>
                        );
                    }

                    return (
                        <GeneralPostCard
                            key={post.id}
                            post={post}
                            menuOpen={openMenuId === post.id}
                            onMenuToggle={() => handleMenuToggle(post.id)}
                            onEdit={() => handleEdit(post)}
                            onDelete={() => handleDelete(post.id)}
                            deleting={postDeleting}
                        />
                    );
                })}
            </div>

            <EditPostModal
                post={editingPost}
                onClose={() => setEditingPost(null)}
            />
        </>
    );
}
