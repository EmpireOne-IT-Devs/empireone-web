import React, { useState, useEffect, useRef, useCallback } from "react";
import { Heart, MessageSquare, Send, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { usePage } from "@inertiajs/react";
import { sync_post_interaction } from "@/app/redux/activities-slice";
import {
    toggle_reaction_service,
    get_post_comments_service,
    add_post_comment_service,
    delete_post_comment_service,
} from "@/app/services/activities-service";

const POLL_INTERVAL_MS = 15_000;

/**
 * Reusable reaction + comment panel.
 *
 * Props:
 *   postId           – number   (required)
 *   reactionCount    – number   initial count from the post feed
 *   commentCount     – number   initial count from the post feed
 *   userHasReacted   – boolean  whether the current user already reacted
 */
export default function PostInteractionPanel({
    postId,
    reactionCount = 0,
    commentCount = 0,
    userHasReacted = false,
}) {
    const dispatch = useDispatch();
    const currentUserId = usePage().props.auth?.user?.id;

    // ── local reaction state ─────────────────────────────────────────────────
    const [localReactionCount, setLocalReactionCount] = useState(reactionCount);
    const [localUserHasReacted, setLocalUserHasReacted] = useState(userHasReacted);
    const [reacting, setReacting] = useState(false);
    const reactingRef = useRef(false); // ref mirrors state for use inside async callbacks

    // ── comment list state ───────────────────────────────────────────────────
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentInput, setCommentInput] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const inputRef = useRef(null);
    const pollRef = useRef(null);

    // Sync prop changes (e.g. parent re-renders with fresh Redux data)
    useEffect(() => { setLocalReactionCount(reactionCount); }, [reactionCount]);
    useEffect(() => { setLocalUserHasReacted(userHasReacted); }, [userHasReacted]);

    // ── fetch + poll ─────────────────────────────────────────────────────────
    const fetchComments = useCallback(async () => {
        try {
            const res = await get_post_comments_service(postId);
            const { data, reaction_count, user_has_reacted } = res.data;
            setComments(data ?? []);
            // Skip overwriting reaction state while a toggle is in-flight
            // to avoid the poll undoing an optimistic update mid-request.
            if (!reactingRef.current) {
                setLocalReactionCount(reaction_count ?? 0);
                setLocalUserHasReacted(user_has_reacted ?? false);
            }
            dispatch(
                sync_post_interaction({
                    postId,
                    reaction_count,
                    user_has_reacted,
                    comment_count: (data ?? []).length,
                })
            );
        } catch {
            // silent — polling will retry
        }
    }, [postId, dispatch]);

    useEffect(() => {
        setCommentsLoading(true);
        fetchComments().finally(() => setCommentsLoading(false));

        // Skip the poll tick when the tab is hidden to avoid unnecessary requests.
        pollRef.current = setInterval(() => {
            if (!document.hidden) fetchComments();
        }, POLL_INTERVAL_MS);
        return () => clearInterval(pollRef.current);
    }, [fetchComments]);

    // ── reaction toggle ──────────────────────────────────────────────────────
    async function handleReact() {
        if (reactingRef.current) return;
        reactingRef.current = true;
        setReacting(true);

        // Optimistic update
        const wasReacted  = localUserHasReacted;
        const prevCount   = localReactionCount;
        setLocalUserHasReacted(!wasReacted);
        setLocalReactionCount((c) => (wasReacted ? c - 1 : c + 1));

        try {
            const res = await toggle_reaction_service(postId, "heart");
            const { reaction_count, user_has_reacted } = res.data.data;
            setLocalReactionCount(reaction_count);
            setLocalUserHasReacted(user_has_reacted);
            dispatch(sync_post_interaction({ postId, reaction_count, user_has_reacted }));
        } catch {
            // rollback on error
            setLocalUserHasReacted(wasReacted);
            setLocalReactionCount(prevCount);
        } finally {
            reactingRef.current = false;
            setReacting(false);
        }
    }

    // ── add comment ──────────────────────────────────────────────────────────
    async function handleSubmitComment(e) {
        e.preventDefault();
        const body = commentInput.trim();
        if (!body || submitting) return;

        setSubmitting(true);
        try {
            const res = await add_post_comment_service(postId, body);
            const newComment = res.data.data;
            setComments((prev) => [newComment, ...prev]);
            setCommentInput("");
            dispatch(
                sync_post_interaction({
                    postId,
                    comment_count: comments.length + 1,
                })
            );
        } catch {
            // silent
        } finally {
            setSubmitting(false);
        }
    }

    // ── delete comment ───────────────────────────────────────────────────────
    async function handleDeleteComment(commentId) {
        if (deletingId) return;
        setDeletingId(commentId);
        try {
            await delete_post_comment_service(postId, commentId);
            setComments((prev) => prev.filter((c) => c.id !== commentId));
            dispatch(
                sync_post_interaction({
                    postId,
                    comment_count: Math.max(0, comments.length - 1),
                })
            );
        } catch {
            // silently ignore — backend enforces ownership
        } finally {
            setDeletingId(null);
        }
    }

    // ── render ───────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col gap-4">
            {/* Action bar */}
            <div className="flex items-center justify-between gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={handleReact}
                        disabled={reacting}
                        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all group
                            ${localUserHasReacted
                                ? "text-red-600 bg-red-50 hover:bg-red-100"
                                : "hover:bg-red-50 hover:text-red-600"
                            }`}
                    >
                        <Heart
                            size={16}
                            className={`transition-transform group-hover:scale-110 ${
                                localUserHasReacted ? "fill-red-500" : ""
                            }`}
                        />
                        <span>{localReactionCount > 0 ? localReactionCount : "Like"}</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => inputRef.current?.focus()}
                        className="flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-blue-50 hover:text-blue-600 transition-all group"
                    >
                        <MessageSquare
                            size={16}
                            className="group-hover:scale-110 transition-transform"
                        />
                        <span>
                            {comments.length > 0 ? `${comments.length} Comment${comments.length !== 1 ? "s" : ""}` : "Comment"}
                        </span>
                    </button>
                </div>
            </div>

            {/* Comment list */}
            <div className="flex flex-col gap-2">
                {commentsLoading && comments.length === 0 ? (
                    <div className="flex flex-col gap-2">
                        {[1, 2].map((i) => (
                            <div
                                key={i}
                                className="h-10 rounded-xl bg-gray-100 animate-pulse"
                            />
                        ))}
                    </div>
                ) : comments.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-3">
                        No comments yet. Be the first to comment!
                    </p>
                ) : (
                    <ul className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                        {comments.map((c) => (
                            <li
                                key={c.id}
                                className="flex items-start gap-2.5 group"
                            >
                                {/* Avatar */}
                                {c.author.avatar ? (
                                    <img
                                        src={c.author.avatar}
                                        alt={c.author.name}
                                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                                    />
                                ) : (
                                    <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-[10px] shrink-0 mt-0.5">
                                        {c.author.initials}
                                    </div>
                                )}

                                {/* Bubble */}
                                <div className="flex-1 min-w-0">
                                    <div className="inline-block max-w-full rounded-2xl rounded-tl-sm bg-gray-100 px-3 py-2">
                                        <p className="text-xs font-semibold text-gray-900 leading-tight mb-0.5">
                                            {c.author.name}
                                        </p>
                                        <p className="text-sm text-gray-700 break-words">
                                            {c.body}
                                        </p>
                                    </div>
                                    <p className="mt-1 pl-1 text-[10px] text-gray-400">
                                        {c.time_ago}
                                    </p>
                                </div>

                                {/* Delete — only for own comments */}
                                {c.user_id === currentUserId && (
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteComment(c.id)}
                                        disabled={deletingId === c.id}
                                        className="mt-1 shrink-0 p-1 rounded-lg text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        title="Delete comment"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Comment input */}
            <form
                onSubmit={handleSubmitComment}
                className="relative flex items-center"
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Write a comment…"
                    className="w-full pl-4 pr-12 py-2.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl outline-none text-sm text-gray-800 placeholder-gray-400 transition-all"
                />
                <button
                    type="submit"
                    disabled={!commentInput.trim() || submitting}
                    className="absolute right-2 p-1.5 rounded-lg text-gray-400 hover:text-blue-600 disabled:hover:text-gray-400 disabled:opacity-40 transition-colors"
                >
                    <Send size={15} className="m-1.5" />
                </button>
            </form>
        </div>
    );
}
