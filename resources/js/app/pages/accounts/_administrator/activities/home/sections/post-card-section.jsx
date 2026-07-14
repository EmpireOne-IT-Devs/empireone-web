import React, { useEffect, useState } from "react";
import {
    Megaphone,
    CalendarDays,
    Newspaper,
    Send,
    Tag,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/app/_components/card";
import PostActionMenu from "./post-action-menu";
import PostInteractionPanel from "@/app/pages/accounts/_administrator/activities/_components/post-interaction-panel";
import { setAlert } from "@/app/redux/app-slice";
import {
    get_engagement_posts_thunk,
    delete_engagement_post_thunk,
    syncInteraction,
} from "@/app/redux/engagement-slice";
import {
    get_engagement_post_comments_service,
    add_engagement_post_comment_service,
    delete_engagement_post_comment_service,
    toggle_engagement_reaction_service,
} from "@/app/services/engagement-service";
import PostCardModalSection from "./post-card-modal-section";
// Import the newly extracted EditPostModal component
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
    General: { icon: Tag, variant: "secondary" },
};

function PostContent({ content, className = "" }) {
    return (
        <div
            className={`overflow-x-hidden break-words text-[15px] text-gray-700 leading-relaxed ${className}`}
            dangerouslySetInnerHTML={{ __html: content ?? "" }}
        />
    );
}

// ── Image Grid (Facebook-style collage) ───────────────────────────────────────
function ImageGrid({ files, clickable = false }) {
    const count = files.length;
    if (count === 0) return null;

    const wrap = (file, idx, className = "") => (
        <div
            key={file.id}
            className={`relative overflow-hidden bg-slate-100 ${className}`}
            onClick={clickable ? undefined : (e) => e.stopPropagation()}
        >
            <img
                src={file.url}
                alt={file.name ?? ""}
                className="h-full w-full object-cover"
            />
        </div>
    );

    if (count === 1) {
        return (
            <div
                className="w-full overflow-hidden bg-black"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={files[0].url}
                    alt={files[0].name ?? ""}
                    className="w-full max-h-[420px] object-contain"
                />
            </div>
        );
    }

    if (count === 2) {
        return (
            <div className="grid grid-cols-2 gap-0.5 h-56">
                {files.map((f, i) => wrap(f, i, "h-full"))}
            </div>
        );
    }

    if (count === 3) {
        return (
            <div className="grid grid-cols-2 gap-0.5 h-64">
                {wrap(files[0], 0, "row-span-2 h-64")}
                {wrap(files[1], 1, "h-[calc(50%-1px)]")}
                {wrap(files[2], 2, "h-[calc(50%-1px)]")}
            </div>
        );
    }

    // 4+ — show max 4 with overflow badge
    const visible = files.slice(0, 4);
    const overflow = count - 4;
    return (
        <div className="grid grid-cols-2 gap-0.5">
            {visible.map((file, idx) => (
                <div
                    key={file.id}
                    className="relative h-44 overflow-hidden bg-slate-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        src={file.url}
                        alt={file.name ?? ""}
                        className="h-full w-full object-cover"
                    />
                    {idx === 3 && overflow > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-white font-bold text-2xl">
                            +{overflow}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

// ── Post Card Component ───────────────────────────────────────────────
function EngagementPostCard({
    post,
    menuOpen,
    onMenuToggle,
    onEdit,
    onDelete,
    onView,
    deleting,
}) {
    const dispatch = useDispatch();
    const categoryKey = post.category ?? "General";
    const catConfig =
        CATEGORY_CONFIG[categoryKey] ?? CATEGORY_CONFIG["General"];
    const CategoryIcon = catConfig.icon;

    return (
        <Card
            variant="default"
            padding="p-0"
            className="w-full overflow-hidden font-sans rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={onView}
        >
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
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {post.author?.initials}
                        </div>
                    )}
                    <div>
                        <p className="font-semibold text-gray-900 text-[14px] leading-tight">
                            {post.author?.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs text-gray-400">
                                {post.time_ago}
                            </span>
                            <span className="text-gray-300 text-[10px]">·</span>
                            <CategoryIcon className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
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
                <p className="font-semibold text-gray-900 text-[15px] mb-1">
                    {post.title}
                </p>
                <PostContent content={post.content} />
            </div>

            {/* Images */}
            {post.files?.length > 0 && <ImageGrid files={post.files} />}

            {/* Interaction */}
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

export default function PostCardSection() {
    const dispatch = useDispatch();
    const { posts, postsLoading, postsError, deleting } = useSelector(
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

    if (postsLoading) {
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