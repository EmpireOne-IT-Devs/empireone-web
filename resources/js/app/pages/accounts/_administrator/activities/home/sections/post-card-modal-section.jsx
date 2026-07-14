import React from "react";
import { useDispatch } from "react-redux";
import { Megaphone, CalendarDays, Newspaper, Send, Tag } from "lucide-react";
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

function ImageGrid({ files }) {
    const count = files.length;
    if (count === 0) return null;

    const wrap = (file, idx, className = "") => (
        <div key={file.id} className={`relative overflow-hidden bg-slate-100 ${className}`}>
            <img src={file.url} alt={file.name ?? ""} className="h-full w-full object-cover" />
        </div>
    );

    if (count === 1) {
        return (
            <div className="w-full overflow-hidden bg-black">
                <img src={files[0].url} alt={files[0].name ?? ""} className="w-full max-h-[420px] object-contain" />
            </div>
        );
    }
    if (count === 2) {
        return <div className="grid grid-cols-2 gap-0.5 h-56">{files.map((f, i) => wrap(f, i, "h-full"))}</div>;
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
    const visible = files.slice(0, 4);
    const overflow = count - 4;
    return (
        <div className="grid grid-cols-2 gap-0.5">
            {visible.map((file, idx) => (
                <div key={file.id} className="relative h-44 overflow-hidden bg-slate-100">
                    <img src={file.url} alt={file.name ?? ""} className="h-full w-full object-cover" />
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

export default function PostCardModalSection({ post, onClose }) {
    if (!post) return null;

    const CATEGORY_CONFIG = {
        Event: { icon: CalendarDays, variant: "primary" },
        News: { icon: Newspaper, variant: "info" },
        Milestone: { icon: Send, variant: "success" },
        Announcement: { icon: Megaphone, variant: "danger" },
        General: { icon: Tag, variant: "secondary" },
    };
    const dispatch = useDispatch();
    const categoryKey = post.category ?? "General";
    const catConfig =
        CATEGORY_CONFIG[categoryKey] ?? CATEGORY_CONFIG["General"];
    const CategoryIcon = catConfig.icon;
    return (
        <div>
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
                width="max-w-3xl"
            >
                <div className="flex flex-col gap-0 pb-4">
                    {/* Author */}
                    <div className="flex items-center gap-3 px-6 py-4">
                        {post.author?.avatar ? (
                            <img
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                {post.author?.initials}
                            </div>
                        )}
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm leading-tight">
                                {post.author?.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-xs text-gray-400">
                                    {post.time_ago}
                                </span>
                                <span className="text-gray-300 text-xs">·</span>
                                <CategoryIcon className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-400">
                                    {categoryKey}
                                </span>
                            </div>
                        </div>
                        <Badge
                            label={categoryKey}
                            variant={catConfig.variant}
                            outlined
                            className="text-[10px]"
                        />
                    </div>

                    <div
                        className="px-6 pb-4 overflow-x-hidden break-words text-[15px] text-gray-800 leading-relaxed [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-bold [&_a]:text-blue-600 [&_a]:underline"
                        dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
                    />

                    {/* Images */}
                    {post.files?.length > 0 && (
                        <ImageGrid files={post.files} clickable />
                    )}

                    {/* Interaction panel */}
                    <div className="px-6 pt-4">
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
            </Modal>
        </div>
    );
}
