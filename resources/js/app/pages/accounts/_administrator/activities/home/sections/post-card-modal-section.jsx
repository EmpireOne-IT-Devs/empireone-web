import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    Megaphone,
    CalendarDays,
    Newspaper,
    Send,
    Tag,
    X,
    ChevronLeft,
    ChevronRight,
    Images,
    ArrowLeft,
} from "lucide-react";
import Modal from "@/app/_components/modal";
import Badge from "@/app/_components/badge";
import PostInteractionPanel from "@/app/pages/accounts/_administrator/activities/_components/post-interaction-panel";
import { syncInteraction } from "@/app/redux/engagement-slice";
import {
    get_engagement_post_comments_service,
    add_engagement_post_comment_service,
    delete_engagement_post_comment_service,
    toggle_engagement_reaction_service,
} from "@/app/services/engagement-service";

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

/* ----------------------------------------------------------------------- */
/* Lightbox — full image viewer with keyboard nav + thumbnail strip        */
/* ----------------------------------------------------------------------- */

function ImageLightbox({ files, startIndex, onClose }) {
    const [index, setIndex] = useState(startIndex);

    const goPrev = useCallback(
        () => setIndex((i) => (i - 1 + files.length) % files.length),
        [files.length]
    );
    const goNext = useCallback(
        () => setIndex((i) => (i + 1) % files.length),
        [files.length]
    );

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "ArrowRight") goNext();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [goPrev, goNext, onClose]);

    const [touchStartX, setTouchStartX] = useState(null);
    const onTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
    const onTouchEnd = (e) => {
        if (touchStartX === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 40) {
            if (delta > 0) goPrev();
            else goNext();
        }
        setTouchStartX(null);
    };

    const current = files[index];

    return (
        <div
            className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="flex items-center justify-between px-4 py-3 text-white/90 sm:px-5 sm:py-4"
                onClick={(e) => e.stopPropagation()}
            >
                <span className="text-xs font-medium tabular-nums text-white/70 sm:text-sm">
                    {index + 1} / {files.length}
                </span>
                <button
                    onClick={onClose}
                    aria-label="Close viewer"
                    className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white active:bg-white/20"
                >
                    <X size={20} />
                </button>
            </div>

            <div
                className="relative flex flex-1 items-center justify-center px-2 pb-3 sm:px-4 sm:pb-4"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                {files.length > 1 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goPrev();
                        }}
                        aria-label="Previous image"
                        className="absolute left-1.5 z-10 rounded-full bg-white/10 p-1.5 text-white transition hover:bg-white/20 sm:left-6 sm:p-2"
                    >
                        <ChevronLeft size={20} className="sm:hidden" />
                        <ChevronLeft size={22} className="hidden sm:block" />
                    </button>
                )}

                <img
                    src={current.url}
                    alt={current.name ?? ""}
                    onClick={(e) => e.stopPropagation()}
                    className="max-h-[70vh] max-w-full select-none rounded-lg object-contain shadow-2xl sm:max-h-[75vh]"
                />

                {files.length > 1 && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goNext();
                        }}
                        aria-label="Next image"
                        className="absolute right-1.5 z-10 rounded-full bg-white/10 p-1.5 text-white transition hover:bg-white/20 sm:right-6 sm:p-2"
                    >
                        <ChevronRight size={20} className="sm:hidden" />
                        <ChevronRight size={22} className="hidden sm:block" />
                    </button>
                )}
            </div>

            {files.length > 1 && (
                <div
                    className="flex justify-center gap-1.5 overflow-x-auto px-3 pb-4 sm:gap-2 sm:px-4 sm:pb-5"
                    onClick={(e) => e.stopPropagation()}
                >
                    {files.map((file, i) => (
                        <button
                            key={file.id}
                            onClick={() => setIndex(i)}
                            className={`h-11 w-11 shrink-0 overflow-hidden rounded-md ring-2 transition sm:h-14 sm:w-14 ${
                                i === index
                                    ? "ring-white"
                                    : "ring-transparent opacity-50 hover:opacity-80"
                            }`}
                        >
                            <img
                                src={file.url}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ----------------------------------------------------------------------- */
/* Image grid — collage layout                                             */
/* ----------------------------------------------------------------------- */

const MAX_VISIBLE = 4;

function ImageGrid({ files, onOpen }) {
    const count = files.length;
    if (count === 0) return null;

    const tile = (file, idx, className = "", showOverlay = false) => (
        <button
            key={file.id}
            type="button"
            onClick={() => onOpen(idx)}
            className={`group relative block h-full min-h-0 w-full min-w-0 overflow-hidden bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${className}`}
        >
            <img
                src={file.url}
                alt={file.name ?? ""}
                className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
            {showOverlay && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 text-white transition group-hover:bg-black/70">
                    <Images size={18} className="sm:hidden" />
                    <Images size={20} className="hidden sm:block" />
                    <span className="text-xs font-semibold sm:text-sm">
                        +{count - MAX_VISIBLE} more
                    </span>
                </div>
            )}
        </button>
    );

    if (count === 1) {
        return (
            <div className="w-full overflow-hidden bg-black">
                <button
                    type="button"
                    onClick={() => onOpen(0)}
                    className="block w-full focus:outline-none"
                >
                    <img
                        src={files[0].url}
                        alt={files[0].name ?? ""}
                        className="max-h-[60vh] w-full object-contain sm:max-h-[420px]"
                    />
                </button>
            </div>
        );
    }

    if (count === 2) {
        return (
            <div className="grid h-48 grid-cols-2 grid-rows-1 gap-0.5 sm:h-64">
                {files.map((f, i) => tile(f, i))}
            </div>
        );
    }

    if (count === 3) {
        return (
            <div className="grid h-56 grid-cols-2 grid-rows-2 gap-0.5 sm:h-72">
                {tile(files[0], 0, "row-span-2")}
                {tile(files[1], 1)}
                {tile(files[2], 2)}
            </div>
        );
    }

    const visible = files.slice(0, MAX_VISIBLE);
    return (
        <div className="grid grid-cols-2 gap-0.5">
            {visible.map((file, idx) =>
                tile(
                    file,
                    idx,
                    `h-32 sm:h-44 ${idx === MAX_VISIBLE - 1 && count > MAX_VISIBLE ? "" : ""}`,
                    idx === MAX_VISIBLE - 1 && count > MAX_VISIBLE
                )
            )}
        </div>
    );
}

/* ----------------------------------------------------------------------- */
/* Shared Inner Body Content                                              */
/* ----------------------------------------------------------------------- */

function PostDetailsBody({ post, setLightboxIndex, dispatch }) {
    const categoryKey = post.category ?? "General";
    const catConfig = CATEGORY_CONFIG[categoryKey] ?? CATEGORY_CONFIG.General;
    const CategoryIcon = catConfig.icon;
    const files = post.files ?? [];

    return (
        <div className="flex flex-col gap-0 pb-6 sm:pb-4">
            {/* Author Section */}
            <div className="flex items-center gap-2.5 px-4 py-3 sm:gap-3 sm:px-6 sm:py-4">
                {post.author?.avatar ? (
                    <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-black/5 sm:h-10 sm:w-10"
                    />
                ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-xs font-bold text-white sm:h-10 sm:w-10 sm:text-sm">
                        {post.author?.initials}
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold leading-tight text-gray-900">
                        {post.author?.name}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-xs text-gray-400">
                            {post.time_ago}
                        </span>
                        <span className="text-xs text-gray-300">·</span>
                        <CategoryIcon className="h-3 w-3 shrink-0 text-gray-400" />
                        <span className="text-xs text-gray-400">
                            {categoryKey}
                        </span>
                    </div>
                </div>
                <Badge
                    label={categoryKey}
                    variant={catConfig.variant}
                    outlined
                    className="hidden shrink-0 text-[10px] sm:inline-flex"
                />
            </div>

            {/* Content */}
            <div
                className="overflow-x-hidden break-words px-4 pb-3 text-[14px] leading-relaxed text-gray-800 sm:px-6 sm:pb-4 sm:text-[15px] [&_a]:text-blue-600 [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
            />

            {/* Images */}
            {files.length > 0 && (
                <ImageGrid files={files} onOpen={(idx) => setLightboxIndex(idx)} />
            )}

            {/* Divider */}
            <div className="mx-4 mt-3 border-t border-gray-100 sm:mx-6 sm:mt-4" />

            {/* Interaction panel */}
            <div className="px-4 pt-3 sm:px-6 sm:pt-4">
                <PostInteractionPanel
                    postId={post.id}
                    reactionCount={post.reaction_count ?? 0}
                    commentCount={post.comment_count ?? 0}
                    userHasReacted={post.user_has_reacted ?? false}
                    services={engagementServices}
                    onSync={(data) => dispatch(syncInteraction(data))}
                />
            </div>
        </div>
    );
}

/* ----------------------------------------------------------------------- */
/* Main component                                                          */
/* ----------------------------------------------------------------------- */

export default function PostCardModalSection({ post, onClose }) {
    const dispatch = useDispatch();
    const [lightboxIndex, setLightboxIndex] = useState(null);

    // Prevent body scrolling when post view is open on mobile
    useEffect(() => {
        if (post) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [post]);

    if (!post) return null;

    const categoryKey = post.category ?? "General";
    const catConfig = CATEGORY_CONFIG[categoryKey] ?? CATEGORY_CONFIG.General;
    const CategoryIcon = catConfig.icon;
    const files = post.files ?? [];

    const TitleContent = (
        <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:h-10 sm:w-10">
                <CategoryIcon size={17} className="sm:hidden" />
                <CategoryIcon size={18} className="hidden sm:block" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-neutral-400 sm:text-[10px]">
                    Engagement / {categoryKey}
                </p>
                <h2 className="truncate text-[14px] font-semibold leading-snug text-neutral-800 sm:text-[15px]">
                    {post.title}
                </h2>
            </div>
        </div>
    );

    return (
        <>
            {/* MOBILE VIEW: Facebook style full-screen page */}
            <div className="fixed inset-0 z-50 flex flex-col bg-white sm:hidden overflow-y-auto">
                {/* Mobile Top Header Navigation */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-3 py-2.5 shadow-sm">
                    <div className="flex items-center gap-2 min-w-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full p-1.5 text-gray-600 hover:bg-gray-100 active:bg-gray-200"
                            aria-label="Back"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <span className="font-semibold text-sm text-gray-800 truncate">
                            Post
                        </span>
                    </div>
                </div>

                {/* Mobile Scrollable Post Content */}
                <div className="flex-1">
                    <PostDetailsBody
                        post={post}
                        setLightboxIndex={setLightboxIndex}
                        dispatch={dispatch}
                    />
                </div>
            </div>

            {/* DESKTOP VIEW: Regular Dialog Modal */}
            <div className="hidden sm:block">
                <Modal
                    isOpen={!!post}
                    onClose={onClose}
                    title={TitleContent}
                    width="max-w-3xl"
                >
                    <PostDetailsBody
                        post={post}
                        setLightboxIndex={setLightboxIndex}
                        dispatch={dispatch}
                    />
                </Modal>
            </div>

            {/* Lightbox for images */}
            {lightboxIndex !== null && (
                <ImageLightbox
                    files={files}
                    startIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                />
            )}
        </>
    );
}