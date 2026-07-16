import React, { useState, useEffect, useRef, useCallback } from "react";
// Added Share2 import
import { Heart, MessageSquare, Send, Share2, Trash2 } from "lucide-react";
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
    const currentProps  = usePage().props;
    const currentUser   = currentProps.auth?.user;
    const currentUserId = currentUser?.id;

    const {
        getComments    = defaultGetComments,
        toggleReaction = defaultToggleReaction,
        addComment     = defaultAddComment,
        deleteComment  = defaultDeleteComment,
    } = services ?? {};

    function syncData(payload) {
        onSync ? onSync(payload) : dispatch(sync_post_interaction(payload));
    }

    const [localReactionCount,  setLocalReactionCount]  = useState(reactionCount);
    const [localUserHasReacted, setLocalUserHasReacted] = useState(userHasReacted);
    const [reacting,            setReacting]            = useState(false);
    const reactingRef = useRef(false);

    const [comments,        setComments]        = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(showComments);
    const [commentInput,    setCommentInput]    = useState("");
    const [submitting,      setSubmitting]      = useState(false);
    const [deletingId,      setDeletingId]      = useState(null);
    const inputRef = useRef(null);
    const pollRef  = useRef(null);

    useEffect(() => { setLocalReactionCount(reactionCount);   }, [reactionCount]);
    useEffect(() => { setLocalUserHasReacted(userHasReacted); }, [userHasReacted]);

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
        } catch { /* silent — polling will retry */ }
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

    async function handleReact() {
        if (reactingRef.current) return;
        reactingRef.current = true;
        setReacting(true);
        const wasReacted = localUserHasReacted;
        const prevCount  = localReactionCount;
        setLocalUserHasReacted(!wasReacted);
        setLocalReactionCount((c) => (wasReacted ? c - 1 : c + 1));
        try {
            // Keep unchanged backend payload string indicator
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

    return (
        <div className="w-full bg-white text-gray-500 text-sm font-normal">
            {/* Meta info header row (Total Hearts / Comments counts) */}
            {(localReactionCount > 0 || displayCount > 0) && (
                <div className="flex items-center justify-between px-3 py-2 text-[13px] text-gray-500 border-b border-gray-200">
                    <div className="flex items-center gap-1.5">
                        {localReactionCount > 0 && (
                            <>
                                <div className="flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white">
                                    <Heart size={10} className="fill-white text-white" />
                                </div>
                                <span className="hover:underline cursor-pointer">{localReactionCount}</span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {displayCount > 0 && (
                            <span className="hover:underline cursor-pointer">
                                {displayCount} {displayCount === 1 ? "comment" : "comments"}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Main Interactive Button Feed Action Bar */}
            <div className="flex items-center justify-between px-1 py-1 border-b border-gray-200">
                <button
                    type="button"
                    onClick={handleReact}
                    disabled={reacting}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 font-semibold rounded-md hover:bg-gray-100 transition-colors ${
                        localUserHasReacted ? "text-red-600" : "text-orange-600"
                    }`}
                >
                    <Heart size={18} className={localUserHasReacted ? "fill-red-500 text-red-600" : ""} />
                    <span>Love</span>
                </button>

                <button
                    type="button"
                    onClick={onCommentClick ?? (() => inputRef.current?.focus())}
                    className="flex-1 flex items-center justify-center gap-2 py-2 font-semibold text-orange-600 rounded-md hover:bg-gray-100 transition-colors"
                >
                    <MessageSquare size={18} />
                    <span>Comment</span>
                </button>

                {/* Static Share Button */}
                <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 py-2 font-semibold text-orange-600 rounded-md hover:bg-gray-100 transition-colors"
                >
                    <Share2 size={18} />
                    <span>Share</span>
                </button>
            </div>

            {/* Comment Area container wrapper */}
            {showComments && (
                <div className="px-4 py-3 flex flex-col gap-3">
                    {/* Top Inline Comment input row with current user's profile image context */}
                    <div className="flex items-start gap-2">
                        {currentUser?.avatar ? (
                            <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-xs shrink-0 mt-0.5">
                                {currentUser?.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                        )}
                        <form onSubmit={handleSubmitComment} className="relative flex-1 flex items-center">
                            <input
                                ref={inputRef}
                                type="text"
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full pl-3 pr-10 py-1.5 bg-gray-100 hover:bg-gray-200/80 focus:bg-gray-100 border-none rounded-2xl outline-none text-[13px] text-gray-800 placeholder-gray-500 focus:ring-0 transition-all"
                            />
                            {commentInput.trim() && (
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="absolute right-2 p-1 text-blue-600 hover:bg-gray-200/50 rounded-full disabled:opacity-40 transition-colors"
                                >
                                    <Send size={14} />
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Render existing comments dynamic list */}
                    <div className="flex flex-col gap-2">
                        {commentsLoading && comments.length === 0 ? (
                            <div className="flex flex-col gap-2 mt-2">
                                {[1, 2].map((i) => (
                                    <div key={i} className="h-9 rounded-2xl bg-gray-100 animate-pulse w-2/3" />
                                ))}
                            </div>
                        ) : (
                            <ul className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1 mt-1">
                                {comments.map((c) => (
                                    <li key={c.id} className="flex items-start gap-2 group">
                                        {c.author.avatar ? (
                                            <img src={c.author.avatar} alt={c.author.name} className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0 mt-0.5">
                                                {c.author.initials}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0 flex flex-col items-start">
                                            {/* Bubble background layout inside Facebook comments */}
                                            <div className="inline-block max-w-[90%] rounded-2xl bg-gray-100 px-3 py-2">
                                                <p className="text-[12px] font-bold text-gray-900 hover:underline cursor-pointer leading-tight mb-0.5">
                                                    {c.author.name}
                                                </p>
                                                <p className="text-[13px] text-gray-800 break-words font-normal leading-normal">{c.body}</p>
                                            </div>
                                            
                                            {/* Timestamp label action parameters below text block */}
                                            <div className="flex items-center gap-3 mt-0.5 pl-2 text-[11px] text-gray-500 font-medium">
                                                <span className="hover:underline cursor-pointer">{c.time_ago}</span>
                                                {c.user_id === currentUserId && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteComment(c.id)}
                                                        disabled={deletingId === c.id}
                                                        className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-0.5"
                                                        title="Delete comment"
                                                    >
                                                        <Trash2 size={11} />
                                                        <span>Delete</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}