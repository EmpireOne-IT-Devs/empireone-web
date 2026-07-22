import React, { useEffect, useState } from "react";
import {
    Megaphone,
    CalendarDays,
    Newspaper,
    Send,
    Tag,
    Cake,
    PartyPopper,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/app/_components/card";
import PostActionMenu from "./post-action-menu";
import PostInteractionPanel from "@/app/pages/accounts/_administrator/activities/_components/post-interaction-panel";
import ActivityPollCard from "@/app/pages/accounts/_administrator/activities/_components/activity-poll-card";
import { setAlert } from "@/app/redux/app-slice";
import {
    get_engagement_posts_thunk,
    delete_engagement_post_thunk,
    syncInteraction,
    cast_poll_vote_thunk,
} from "@/app/redux/engagement-slice";
import {
    get_engagement_post_comments_service,
    add_engagement_post_comment_service,
    delete_engagement_post_comment_service,
    toggle_engagement_reaction_service,
} from "@/app/services/engagement-service";
import PostCardModalSection from "./post-card-modal-section";
import EditPostModal from "./edit-post-modal";

const REFRESH_INTERVAL_MS = 30_000;

// Engagement-specific services passed to PostInteractionPanel
const engagementServices = {
    getComments: get_engagement_post_comments_service,
    toggleReaction: (postId) => toggle_engagement_reaction_service(postId),
    addComment: add_engagement_post_comment_service,
    deleteComment: delete_engagement_post_comment_service,
};

const CATEGORY_CONFIG = {
    Event: { icon: CalendarDays, variant: "primary" },
    News: { icon: Newspaper, variant: "info" },
    Milestone: { icon: Send, variant: "success" },
    Announcement: { icon: Megaphone, variant: "danger" },
    Birthday: { icon: Cake, variant: "warning" },
    General: { icon: Tag, variant: "secondary" },
};

// ── Helper to robustly extract celebrants list from any JSON structure ──
function extractCelebrants(post) {
    if (!post) return [];

    const parseIfString = (val) => {
        if (typeof val === "string") {
            try {
                return JSON.parse(val);
            } catch {
                return val;
            }
        }
        return val;
    };

    // Normalize common containers we might receive from the API
    const dataObj = parseIfString(post.data ?? post.metadata ?? post.post_data ?? {});

    const candidates = [
        post.celebrants,
        post.celebrants_list,
        post.users,
        post.members,
        dataObj?.celebrants,
        dataObj?.celebrants_list,
        dataObj?.users,
        dataObj?.members,
        dataObj?.birthday_celebrants,
    ];

    const toArray = (val) => {
        const parsed = parseIfString(val);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        // Sometimes the API returns an object keyed by id: { "12": { user_id: 12, name: "..." }, ... }
        if (parsed && typeof parsed === "object") {
            const vals = Object.values(parsed).filter(Boolean);
            if (vals.length > 0) return vals;
        }
        return null;
    };

    for (let candidate of candidates) {
        const arr = toArray(candidate);
        if (Array.isArray(arr) && arr.length > 0) {
            return arr;
        }
    }

    return [];
}

function PostContent({ content, className = "" }) {
    if (!content) return null;
    return (
        <div
            className={`overflow-x-hidden break-words text-[15px] text-gray-700 leading-relaxed ${className}`}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}

// ── Image Grid Component ─────────────────────────────────────────────
function ImageGrid({ files, clickable = false }) {
    if (!files || files.length === 0) return null;
    const count = files.length;

    const wrap = (file, idx, className = "") => (
        <div
            key={file.id || idx}
            className={`relative overflow-hidden bg-slate-100 cursor-pointer ${className}`}
            onClick={clickable ? undefined : (e) => e.stopPropagation()}
        >
            <img
                src={file.url}
                alt={file.name ?? ""}
                className="h-full w-full object-cover hover:scale-[1.02] transition-transform duration-300 ease-out"
            />
        </div>
    );

    if (count === 1) {
        return (
            <div
                className="w-full overflow-hidden bg-black max-h-[450px] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={files[0].url}
                    alt={files[0].name ?? ""}
                    className="w-full max-h-[450px] object-cover"
                />
            </div>
        );
    }

    if (count === 2) {
        return (
            <div className="grid grid-cols-2 gap-1 h-[280px]">
                {files.map((f, i) => wrap(f, i, "h-full"))}
            </div>
        );
    }

    if (count === 3) {
        return (
            <div className="grid grid-cols-2 grid-rows-2 gap-1 h-[340px]">
                {wrap(files[0], 0, "row-span-2 col-span-1 h-full")}
                {wrap(files[1], 1, "h-full")}
                {wrap(files[2], 2, "h-full")}
            </div>
        );
    }

    const visible = files.slice(0, 4);
    const overflow = count - 4;

    return (
        <div className="grid grid-cols-2 grid-rows-2 gap-1 h-[360px]">
            {visible.map((file, idx) => (
                <div
                    key={file.id || idx}
                    className="relative overflow-hidden bg-slate-100"
                    onClick={clickable ? undefined : (e) => e.stopPropagation()}
                >
                    <img
                        src={file.url}
                        alt={file.name ?? ""}
                        className="h-full w-full object-cover hover:scale-[1.02] transition-transform duration-300 ease-out"
                    />
                    {idx === 3 && overflow > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white font-bold text-2xl transition-all select-none hover:bg-black/50">
                            +{overflow}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function EngagementPostCard({
    post,
    menuOpen,
    onMenuToggle,
    onEdit,
    onDelete,
    onView,
    deleting,
    pollVotingPostId,
    onVote,
}) {
    const dispatch = useDispatch();
    const isBirthday = post.type === "birthday" || post.category === "Birthday";
    const categoryKey = isBirthday ? "Birthday" : post.category ?? "General";
    const catConfig =
        CATEGORY_CONFIG[categoryKey] ?? CATEGORY_CONFIG["General"];
    const CategoryIcon = catConfig.icon;

    // Handle Poll Posts
    if (post.type === "poll") {
        return (
            <div className="relative">
                <ActivityPollCard
                    post={post}
                    pollVoting={pollVotingPostId === post.id}
                    onVote={(optionId) => onVote(post.id, optionId)}
                    headerActions={
                        <PostActionMenu
                            open={menuOpen}
                            onToggle={onMenuToggle}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            deleting={deleting}
                        />
                    }
                />
            </div>
        );
    }

    // Extract title, content, and celebrants list safely
    const titleText = post.title ?? post.headline;
    const bodyContent = post.content ?? post.message;
    const celebrantsList = extractCelebrants(post);

    return (
        <Card
            variant="default"
            padding="p-0"
            className={`w-full overflow-hidden font-sans rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border ${
                isBirthday
                    ? "border-pink-200 bg-gradient-to-b from-pink-50/50 via-white to-white"
                    : "border-gray-100"
            }`}
            onClick={onView}
        >
            {/* Celebratory Top Banner for Birthdays */}
            {isBirthday && (
                <div className="bg-gradient-to-r from-orange-500 via-purple-500 to-indigo-500 px-4 py-1.5 flex items-center justify-between text-white text-xs font-semibold tracking-wide">
                    <div className="flex items-center gap-1.5">
                        <PartyPopper className="w-4 h-4 animate-pulse" />
                        <span>Birthday Celebration</span>
                    </div>
                    <Cake className="w-4 h-4 text-pink-200" />
                </div>
            )}

            {/* Header */}
            <div
                className="flex items-start justify-between px-4 pt-4 pb-2"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3">
                    {post.author?.avatar ? (
                        <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className={`w-10 h-10 rounded-full object-cover ring-2 ${
                                isBirthday ? "ring-pink-400" : "ring-white"
                            }`}
                        />
                    ) : (
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                                isBirthday
                                    ? "bg-gradient-to-br from-pink-500 to-rose-600"
                                    : "bg-gradient-to-br from-violet-500 to-purple-600"
                            }`}
                        >
                            {post.author?.initials}
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-gray-900 text-[14px] leading-tight flex items-center gap-1.5">
                            {post.author?.name}
                            {isBirthday && (
                                <span className="inline-flex items-center rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-medium text-pink-700">
                                    🎂 Birthday
                                </span>
                            )}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs text-orange-400">
                                {post.time_ago}
                            </span>
                            <span className="text-gray-300 text-[10px]">·</span>
                            <CategoryIcon
                                className={`h-3 w-3 ${
                                    isBirthday ? "text-pink-500" : "text-purple-600"
                                }`}
                            />
                            <span
                                className={`text-xs ${
                                    isBirthday ? "text-pink-500 font-medium" : "text-purple-400"
                                }`}
                            >
                                {categoryKey}
                            </span>
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

            {/* Body */}
            <div className="px-4 pb-3">
                {titleText && (
                    <p className="font-semibold text-gray-900 text-[15px] mb-1">
                        {titleText}
                    </p>
                )}
                {bodyContent && <PostContent content={bodyContent} />}

                {/* Birthday Celebrants Badge Area */}
                {celebrantsList.length > 0 && (
                    <div className="mt-3 border border-pink-100 bg-pink-50/60 rounded-xl p-3 flex flex-col gap-2">
                        <p className="text-xs font-bold text-pink-600 uppercase tracking-wider flex items-center gap-1">
                            🎂 Birthday Celebrants
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {celebrantsList.map((c, i) => {
                                const name =
                                    typeof c === "object"
                                        ? (c.name ?? c.full_name ?? c.user_name)
                                        : c;
                                return (
                                    <span
                                        key={c.id ?? c.user_id ?? i}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-pink-200 rounded-full text-xs font-medium text-gray-800 shadow-sm"
                                    >
                                        🎉 {name}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Images */}
            {post.files?.length > 0 && (
                <div className="w-full border-y border-gray-100">
                    <ImageGrid files={post.files} />
                </div>
            )}

            {/* Interaction Panel */}
            <div onClick={(e) => e.stopPropagation()}>
                <PostInteractionPanel
                    postId={post.id}
                    reactionCount={post.reaction_count ?? 0}
                    commentCount={post.comment_count ?? 0}
                    userHasReacted={post.user_has_reacted ?? false}
                    showComments={false}
                    onCommentClick={(e) => {
                        e?.stopPropagation?.();
                        onView();
                    }}
                    services={engagementServices}
                    onSync={(data) => dispatch(syncInteraction(data))}
                />
            </div>
        </Card>
    );
}

// ── Main PostCardSection Component ───────────────────────────────────
export default function PostCardSection() {
    const dispatch = useDispatch();
    const { posts, postsLoading, postsError, deleting, pollVotingPostId } = useSelector(
        (state) => state.engagement,
    );

    const [openMenuId, setOpenMenuId] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const [viewingPost, setViewingPost] = useState(null);

    const liveEditPost = editingPost
        ? (posts.find((p) => p.id === editingPost.id) ?? null)
        : null;

    useEffect(() => {
        dispatch(get_engagement_posts_thunk());
        const interval = setInterval(() => {
            if (!document.hidden) dispatch(get_engagement_posts_thunk());
        }, REFRESH_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [dispatch]);

    async function handleDelete(id) {
        const result = await dispatch(delete_engagement_post_thunk(id));
        if (delete_engagement_post_thunk.fulfilled.match(result)) {
            dispatch(
                setAlert({
                    type: "success",
                    title: "Post deleted successfully!",
                    open: true,
                }),
            );
        } else {
            dispatch(
                setAlert({
                    type: "error",
                    title: "Failed to delete post",
                    open: true,
                }),
            );
        }
    }

    if (postsLoading && posts.length === 0) {
        return (
            <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="w-full h-40 bg-gray-100 rounded-xl animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (postsError && posts.length === 0) {
        return (
            <div className="flex items-center justify-center py-16 text-sm text-red-400">
                Failed to load posts. Please refresh and try again.
            </div>
        );
    }

    if (posts.length === 0 && !postsLoading) {
        return (
            <div className="flex items-center justify-center py-16 text-sm text-gray-400">
                No posts yet.
            </div>
        );
    }

    return (
        <>
            <div className="w-full flex flex-col gap-3">
                {posts.map((post) => (
                    <EngagementPostCard
                        key={post.id}
                        post={post}
                        menuOpen={openMenuId === post.id}
                        onMenuToggle={() =>
                            setOpenMenuId((prev) =>
                                prev === post.id ? null : post.id,
                            )
                        }
                        onEdit={() => {
                            setOpenMenuId(null);
                            setEditingPost(post);
                        }}
                        onDelete={() => {
                            setOpenMenuId(null);
                            handleDelete(post.id);
                        }}
                        onView={() => setViewingPost(post)}
                        deleting={deleting}
                        pollVotingPostId={pollVotingPostId}
                        onVote={(postId, optionId) =>
                            dispatch(cast_poll_vote_thunk({ postId, optionId }))
                        }
                    />
                ))}
            </div>

            {liveEditPost && (
                <EditPostModal
                    post={liveEditPost}
                    onClose={() => setEditingPost(null)}
                />
            )}

            <PostCardModalSection
                post={viewingPost}
                onClose={() => setViewingPost(null)}
            />
        </>
    );
}