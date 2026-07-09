import React, { useEffect, useState } from "react";
import {
    Megaphone,
    CalendarDays,
    Newspaper,
    Send,
    Tag,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Card from "@/app/_components/card";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Wysiwyg from "@/app/_components/wysiwyg";
import PostActionMenu from "./post-action-menu";
import { setAlert } from "@/app/redux/app-slice";
import {
    get_engagement_posts_thunk,
    update_engagement_post_thunk,
    delete_engagement_post_thunk,
} from "@/app/redux/engagement-slice";
import { FaPaperPlane } from "react-icons/fa";

const REFRESH_INTERVAL_MS = 30_000;

const CATEGORY_CONFIG = {
    Event:        { icon: CalendarDays, variant: "primary" },
    News:         { icon: Newspaper,   variant: "info" },
    Milestone:    { icon: Send,        variant: "success" },
    Announcement: { icon: Megaphone,   variant: "danger" },
    General:      { icon: Tag,         variant: "secondary" },
};

const CATEGORIES = [
    { id: "Event",        icon: CalendarDays },
    { id: "News",         icon: Newspaper },
    { id: "Milestone",    icon: Send },
    { id: "Announcement", icon: Megaphone },
];

function PostContent({ content, className = "" }) {
    return (
        <div
            className={`overflow-x-hidden break-words text-sm text-gray-700 leading-relaxed ${className}`}
            dangerouslySetInnerHTML={{ __html: content ?? "" }}
        />
    );
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
function EditPostModal({ post, onClose }) {
    const dispatch = useDispatch();
    const { updating } = useSelector((state) => state.engagement);

    const [selectedCategory, setSelectedCategory] = useState(post?.category ?? "Event");

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title:   post?.title   ?? "",
            content: post?.content ?? "",
        },
    });

    const content = watch("content");

    const onSubmit = async (data) => {
        const result = await dispatch(
            update_engagement_post_thunk({
                id:   post.id,
                data: { ...data, category: selectedCategory },
            }),
        );
        if (update_engagement_post_thunk.fulfilled.match(result)) {
            dispatch(setAlert({ type: "success", title: "Post updated successfully!", open: true }));
            onClose();
        } else {
            dispatch(setAlert({ type: "error", title: "Failed to update post", open: true }));
        }
    };

    if (!post) return null;

    return (
        <Modal
            isOpen={!!post}
            onClose={onClose}
            title={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
                        <FaPaperPlane size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                            Engagement / Edit
                        </p>
                        <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                            Edit Post
                        </h2>
                    </div>
                </div>
            }
            width="max-w-3xl"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-6">
                {/* Category pills */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Category</label>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(({ id, icon: Icon }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setSelectedCategory(id)}
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                                    selectedCategory === id
                                        ? "border-slate-500 bg-white text-slate-800 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.25)]"
                                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                                }`}
                            >
                                <Icon className="h-3.5 w-3.5" />
                                <span>{id}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Title */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter a title..."
                        className={`w-full rounded-3xl border px-5 py-3.5 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 ${
                            errors.title ? "border-red-400" : "border-slate-200"
                        }`}
                        {...register("title", { required: "Title is required" })}
                    />
                    {errors.title && (
                        <p className="text-xs text-red-500">{errors.title.message}</p>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">
                        Content <span className="text-red-500">*</span>
                    </label>
                    <Wysiwyg
                        value={content ?? ""}
                        onChange={(val) => setValue("content", val)}
                    />
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                    <Button type="button" variant="light" outlined onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={updating}>
                        Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

// ── View Modal ────────────────────────────────────────────────────────────────
function ViewPostModal({ post, onClose }) {
    if (!post) return null;

    const categoryKey = post.category ?? "General";
    const catConfig   = CATEGORY_CONFIG[categoryKey] ?? CATEGORY_CONFIG["General"];
    const CategoryIcon = catConfig.icon;

    return (
        <Modal
            isOpen={!!post}
            onClose={onClose}
            title={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
                        <CategoryIcon size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                            Engagement / {categoryKey}
                        </p>
                        <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                            {post.title}
                        </h2>
                    </div>
                </div>
            }
            width="max-w-2xl"
        >
            <div className="flex flex-col gap-5 p-6">
                {/* Author meta */}
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                        {post.author?.avatar ? (
                            <img src={post.author.avatar} alt={post.author.name} className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                {post.author?.initials}
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-semibold text-gray-900 leading-tight">{post.author?.name}</p>
                            <p className="text-xs text-gray-400">Engagement • {post.time_ago}</p>
                        </div>
                    </div>
                    <Badge label={categoryKey} variant={catConfig.variant} outlined className="text-[10px]" />
                </div>

                {/* Content */}
                <div
                    className="overflow-x-hidden break-words text-sm text-gray-700 leading-relaxed [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-bold [&_a]:text-blue-600 [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
                />
            </div>
        </Modal>
    );
}

// ── Post Card ─────────────────────────────────────────────────────────────────
function EngagementPostCard({ post, menuOpen, onMenuToggle, onEdit, onDelete, onView, deleting }) {
    const categoryKey = post.category ?? "General";
    const catConfig   = CATEGORY_CONFIG[categoryKey] ?? CATEGORY_CONFIG["General"];

    return (
        <Card
            variant="default"
            padding="p-0"
            className="w-full overflow-hidden font-sans cursor-pointer"
            onClick={onView}
        >
            <div
                className="px-4 pt-4 pb-3 flex justify-between items-start w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-2.5">
                    {post.author?.avatar ? (
                        <img src={post.author.avatar} alt={post.author.name} className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-xs">
                            {post.author?.initials}
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{post.author?.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-xs text-gray-400">Engagement • {post.time_ago}</p>
                            <span className="text-gray-300">·</span>
                            <Badge label={categoryKey} variant={catConfig.variant} outlined className="text-[10px] py-0" />
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

            <div className="px-4 pb-4 flex flex-col gap-1">
                <p className="font-semibold text-gray-900 text-sm">{post.title}</p>
                <PostContent content={post.content} />
            </div>
        </Card>
    );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export default function PostCardSection() {
    const dispatch = useDispatch();
    const { posts, postsLoading, postsError, deleting } = useSelector(
        (state) => state.engagement,
    );

    const [openMenuId,  setOpenMenuId]  = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const [viewingPost, setViewingPost] = useState(null);

    // Always derive from live Redux state so modals reflect latest data
    const liveEditPost = editingPost ? (posts.find((p) => p.id === editingPost.id) ?? null) : null;
    const liveViewPost = viewingPost ? (posts.find((p) => p.id === viewingPost.id) ?? null) : null;

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
            dispatch(setAlert({ type: "success", title: "Post deleted successfully!", open: true }));
        } else {
            dispatch(setAlert({ type: "error", title: "Failed to delete post", open: true }));
        }
    }

    if (postsLoading) {
        return (
            <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="w-full h-40 bg-gray-100 rounded-2xl animate-pulse" />
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
            <div className="w-full flex flex-col gap-4">
                {posts.map((post) => (
                    <EngagementPostCard
                        key={post.id}
                        post={post}
                        menuOpen={openMenuId === post.id}
                        onMenuToggle={() => setOpenMenuId((prev) => (prev === post.id ? null : post.id))}
                        onEdit={() => { setOpenMenuId(null); setEditingPost(post); }}
                        onDelete={() => { setOpenMenuId(null); handleDelete(post.id); }}
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

            {liveViewPost && (
                <ViewPostModal
                    post={liveViewPost}
                    onClose={() => setViewingPost(null)}
                />
            )}
        </>
    );
}
