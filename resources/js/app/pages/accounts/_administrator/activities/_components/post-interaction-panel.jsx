import React, { useState, useEffect, useRef, useCallback } from "react";
import { Heart, MessageSquare, Send, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { usePage } from "@inertiajs/react";
import { sync_post_interaction } from "@/app/redux/activities-slice";
import {
    toggle_reaction_service       as defaultToggleReaction,
    get_post_comments_service     as defaultGetComments,
    add_post_comment_service      as defaultAddComment,
    delete_post_comment_service   as defaultDeleteComment,
} from "@/app/services/activities-service";

const POLL_INTERVAL_MS = 15_000;

/**
 * Reusable reaction + comment panel.
 *
 * Props:
 *   postId           â€“ number    (required)
 *   reactionCount    â€“ number    initial count from the feed
 *   commentCount     â€“ number    initial count from the feed
 *   userHasReacted   â€“ boolean   whether the current user already reacted
 *   showComments     â€“ boolean   show the comment list + input (default true)
 *   onCommentClick   â€“ function  override for the Comment button (e.g. open a modal)
 *   services         â€“ object    { getComments, toggleReaction, addComment, deleteComment }
 *                                defaults to activities services
 *   onSync           â€“ function  (payload) => void  override for Redux sync
 *                                defaults to dispatch(sync_post_interaction)
 */
export default function PostInteractionPanel({
    postId,
    reactionCount  = 0,
    commentCount   = 0,
    userHasReacted = false,
    showComments   = true,
    onCommentClick = null,
    services,
    onSync,
}) {
    const dispatch      = useDispatch();
    const currentUserId = usePage().props.auth?.user?.id;

    const {
        getComments    = defaultGetComments,
        toggleReaction = defaultToggleReaction,
        addComment     = defaultAddComment,
        deleteComment  = defaultDeleteComment,
    } = services ?? {};

    function syncData(payload) {
        onSync ? onSync(payload) : dispatch(sync_post_interaction(payload));
    }

    // â”€â”€ local reaction state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const [localReactionCount,  setLocalReactionCount]  = useState(reactionCount);
    const [localUserHasReacted, setLocalUserHasReacted] = useState(userHasReacted);
    const [reacting,            setReacting]            = useState(false);
    const reactingRef = useRef(false);

    // â”€â”€ comment list state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const [comments,        setComments]        = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(showComments);
    const [commentInput,    setCommentInput]    = useState("");
    const [submitting,      setSubmitting]      = useState(false);
    const [deletingId,      setDeletingId]      = useState(null);
    const inputRef = useRef(null);
    const pollRef  = useRef(null);

    useEffect(() => { setLocalReactionCount(reactionCount);   }, [reactionCount]);
    useEffect(() => { setLocalUserHasReacted(userHasReacted); }, [userHasReacted]);

    // â”€â”€ fetch + poll (skipped when showComments = false) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const fetchComments = useCallback(async () => {
        try {
            const res = await getComments(postId);
            const { data, reaction_count, user_has_reacted } = res.data;
            setComments(data ?? []);
            if (!reactingRef.current) {
                setLocalReactionCount(reaction_count  ?? 0);
                setLocalUserHasReacted(user_has_reacted ?? false);
            }
            syncData({ postId, reaction_count, user_has_reacted, comment_count: (data ?? []).length });
        } catch { /* silent â€” polling will retry */ }
    }, [postId, getComments]);

    useEffect(() => {
        if (!showComments) return;
        setCommentsLoading(true);
        fetchComments().finally(() => setCommentsLoading(false));
        pollRef.current = setInterval(() => {
            if (!document.hidden) fetchComments();
        }, POLL_INTERVAL_MS);
        return () => clearInterval(pollRef.current);
    }, [fetchComments, showComments]);

    // â”€â”€ reaction toggle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    async function handleReact() {
        if (reactingRef.current) return;
        reactingRef.current = true;
        setReacting(true);
        const wasReacted = localUserHasReacted;
        const prevCount  = localReactionCount;
        setLocalUserHasReacted(!wasReacted);
        setLocalReactionCount((c) => (wasReacted ? c - 1 : c + 1));
        try {
            const res = await toggleReaction(postId, "heart");
            const { reaction_count, user_has_reacted } = res.data.data;
            setLocalReactionCount(reaction_count);
            setLocalUserHasReacted(user_has_reacted);
            syncData({ postId, reaction_count, user_has_reacted });
        } catch {
            setLocalUserHasReacted(wasReacted);
            setLocalReactionCount(prevCount);
        } finally {
            reactingRef.current = false;
            setReacting(false);
        }
    }

    // â”€â”€ add comment â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    async function handleSubmitComment(e) {
        e.preventDefault();
        const body = commentInput.trim();
        if (!body || submitting) return;
        setSubmitting(true);
        try {
            const res = await addComment(postId, body);
            setComments((prev) => [res.data.data, ...prev]);
            setCommentInput("");
            syncData({ postId, comment_count: comments.length + 1 });
        } catch { /* silent */ }
        finally { setSubmitting(false); }
    }

    // â”€â”€ delete comment â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    async function handleDeleteComment(commentId) {
        if (deletingId) return;
        setDeletingId(commentId);
        try {
            await deleteComment(postId, commentId);
            setComments((prev) => prev.filter((c) => c.id !== commentId));
            syncData({ postId, comment_count: Math.max(0, comments.length - 1) });
        } catch { /* silent */ }
        finally { setDeletingId(null); }
    }

    const displayCount = showComments ? comments.length : commentCount;

    // â”€â”€ render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    return (
        <div className="flex flex-col gap-4">
            {/* Action bar */}
            <div className="flex items-center justify-between gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={handleReact}
                        disabled={reacting}
                        className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all group ${
                            localUserHasReacted
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
                        onClick={onCommentClick ?? (() => inputRef.current?.focus())}
                        className="flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-blue-50 hover:text-blue-600 transition-all group"
                    >
                        <MessageSquare size={16} className="group-hover:scale-110 transition-transform" />
                        <span>
                            {displayCount > 0
                                ? `${displayCount} Comment${displayCount !== 1 ? "s" : ""}`
                                : "Comment"}
                        </span>
                    </button>
                </div>
            </div>

            {/* Comment list + input â€” only when showComments = true */}
            {showComments && (
                <>
                    <div className="flex flex-col gap-2">
                        {commentsLoading && comments.length === 0 ? (
                            <div className="flex flex-col gap-2">
                                {[1, 2].map((i) => (
                                    <div key={i} className="h-10 rounded-xl bg-gray-100 animate-pulse" />
                                ))}
                            </div>
                        ) : comments.length === 0 ? (
                            <p className="text-xs text-gray-400 text-center py-3">
                                No comments yet. Be the first to comment!
                            </p>
                        ) : (
                            <ul className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                                {comments.map((c) => (
                                    <li key={c.id} className="flex items-start gap-2.5 group">
                                        {c.author.avatar ? (
                                            <img src={c.author.avatar} alt={c.author.name} className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5" />
                                        ) : (
                                            <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-[10px] shrink-0 mt-0.5">
                                                {c.author.initials}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="inline-block max-w-full rounded-2xl rounded-tl-sm bg-gray-100 px-3 py-2">
                                                <p className="text-xs font-semibold text-gray-900 leading-tight mb-0.5">{c.author.name}</p>
                                                <p className="text-sm text-gray-700 break-words">{c.body}</p>
                                            </div>
                                            <p className="mt-1 pl-1 text-[10px] text-gray-400">{c.time_ago}</p>
                                        </div>
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

                    <form onSubmit={handleSubmitComment} className="relative flex items-center">
                        <input
                            ref={inputRef}
                            type="text"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            placeholder="Write a commentâ€¦"
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
                </>
            )}
        </div>
    );
}
