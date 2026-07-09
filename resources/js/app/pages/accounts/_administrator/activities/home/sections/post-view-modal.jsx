import React from "react";
import { Megaphone, CalendarDays, Newspaper, Send, Tag } from "lucide-react";
import Modal from "@/app/_components/modal";
import Badge from "@/app/_components/badge";
import PostInteractionPanel from "../../_components/post-interaction-panel";

const CATEGORY_CONFIG = {
    "Pinned Announcement": { icon: Megaphone, variant: "danger" },
    Events:                { icon: CalendarDays, variant: "primary" },
    News:                  { icon: Newspaper, variant: "info" },
    Milestone:             { icon: Send, variant: "success" },
    General:               { icon: Tag, variant: "secondary" },
};

function WysiwygContent({ html }) {
    return (
        <div
            className="overflow-x-hidden text-sm leading-7 text-gray-600 break-words [&_*]:max-w-full [&_a]:break-all [&_a]:text-blue-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_b]:font-bold [&_em]:italic [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_i]:italic [&_img]:my-3 [&_img]:rounded-xl [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_strong]:font-bold [&_strong]:text-gray-800 [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-gray-200 [&_td]:p-2 [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:p-2 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: html ?? "" }}
        />
    );
}

/**
 * Generic post-view modal for General / Birthday posts in the home feed.
 *
 * Props:
 *   post    – ActivityPost object from Redux (or null)
 *   isOpen  – boolean
 *   onClose – function
 */
export default function PostViewModal({ post, isOpen, onClose }) {
    if (!post) return null;

    const categoryKey = post.category ?? "General";
    const catConfig   = CATEGORY_CONFIG[categoryKey] ?? CATEGORY_CONFIG["General"];
    const CategoryIcon = catConfig.icon;

    const isBirthday = post.type === "birthday";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                        <CategoryIcon size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                            Activities / {isBirthday ? "Birthday" : categoryKey}
                        </p>
                        <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                            {post.headline}
                        </h2>
                    </div>
                </div>
            }
            width="max-w-2xl"
        >
            <div className="flex flex-col gap-5">
                {/* Birthday banner */}
                {isBirthday && (
                    <div className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 px-5 py-4 flex items-center gap-3 rounded-xl">
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
                )}

                {/* Media */}
                {post.media_url && (
                    <div className="w-full overflow-hidden rounded-2xl bg-gray-100">
                        {post.media_type === "video" ? (
                            <video
                                src={post.media_url}
                                controls
                                className="w-full max-h-72 object-contain bg-black"
                            />
                        ) : (
                            <img
                                src={post.media_url}
                                alt={post.headline}
                                className="w-full max-h-72 object-cover"
                            />
                        )}
                    </div>
                )}

                {/* Author meta */}
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                        {post.author?.avatar ? (
                            <img
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="w-9 h-9 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                {post.author?.initials}
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-semibold text-gray-900 leading-tight">
                                {post.author?.name}
                            </p>
                            <p className="text-xs text-gray-400">
                                Activities • {post.time_ago}
                            </p>
                        </div>
                    </div>
                    {!isBirthday && (
                        <Badge
                            label={categoryKey}
                            variant={catConfig.variant}
                            outlined
                            className="text-[10px]"
                        />
                    )}
                </div>

                {/* Content */}
                <WysiwygContent html={post.message} />

                <hr className="border-gray-100" />

                {/* Interaction panel */}
                <PostInteractionPanel
                    postId={post.id}
                    reactionCount={post.reaction_count ?? 0}
                    commentCount={post.comment_count ?? 0}
                    userHasReacted={post.user_has_reacted ?? false}
                />
            </div>
        </Modal>
    );
}
