import React, { useState } from "react";
import { Heart, MessageSquare, Share2, Send, Newspaper } from "lucide-react";
import Badge from "@/app/_components/badge";
import Modal from "@/app/_components/modal";

const categoryVariantMap = {
    Business: "primary",
    Product: "success",
    HR: "purple",
    Finance: "warning",
    Sales: "info",
};

export default function ViewNewsSection({ item, isOpen, onClose }) {
    const [comment, setComment] = useState("");

    const handleSendComment = (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setComment("");
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                        <Newspaper />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                            Activities / Company NewsFeed
                        </p>
                        <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                            News Article
                        </h2>
                    </div>
                </div>
            }
            width="max-w-2xl h-max"
        >
            {item && (
                <div className="flex flex-col -mx-6 -mb-6 w-full overflow-hidden rounded-b-lg">
                    <div className="relative w-full h-64 bg-gray-200 shrink-0 overflow-hidden max-w-full">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-5 left-6 right-6">
                            <div className="flex items-center gap-3 mb-2 ml-2">
                                <Badge
                                    label={item.category}
                                    variant={
                                        categoryVariantMap[item.category] ??
                                        "primary"
                                    }
                                    className="text-[10px] font-semibold uppercase tracking-wider"
                                />
                                <span className="text-white/80 text-xs font-medium">
                                    {item.date}
                                </span>
                            </div>
                            <h2 className="text-white font-bold text-xl md:text-2xl leading-snug tracking-tight ml-2">
                                {item.title}
                            </h2>
                        </div>
                    </div>

                    {/* Article Body */}
                    <div className="px-6 py-5 flex-1">
                        {/* Author Metadata */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-sm">
                                C
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    Communications Team
                                </p>
                                <p className="text-xs text-gray-500">
                                    Published on {item.date}
                                </p>
                            </div>
                        </div>

                        {/* Full Content */}
                        <div className="prose prose-sm max-w-none">
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {item.description} This comprehensive article
                                explores the details behind this significant
                                development. Our team has been working
                                tirelessly to bring you the latest updates and
                                insights. Stay tuned for more information as
                                this story develops. We appreciate your
                                continued interest and engagement with our
                                company news.
                            </p>
                        </div>

                        <hr className="border-gray-100 my-5" />

                        {/* Comment Input Form */}
                        <form
                            onSubmit={handleSendComment}
                            className="relative flex items-center mt-2"
                        >
                            <input
                                type="text"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full pl-4 pr-12 py-2.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 focus:border-blue-500 rounded-xl outline-none text-sm text-gray-800 placeholder-gray-400 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!comment.trim()}
                                className="absolute right-2 p-1.5 rounded-lg text-gray-400 hover:text-blue-600 disabled:hover:text-gray-400 disabled:opacity-40 transition-colors"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </div>

                    {/* Footer Actions Panel */}
                    {/* FIX 3: Rebalanced widths and gap layouts to keep elements neatly inside the footer box */}
                    <div className="flex items-center justify-between sm:justify-start gap-2 px-6 py-3 bg-gray-50 border-t border-gray-100 text-sm font-medium text-gray-600 w-full">
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all group">
                                <Heart
                                    size={16}
                                    className="group-hover:scale-110 transition-transform"
                                />
                                <span>Like</span>
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all group">
                                <MessageSquare
                                    size={16}
                                    className="group-hover:scale-110 transition-transform"
                                />
                                <span>Comment</span>
                            </button>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all group sm:ml-auto">
                            <Share2
                                size={16}
                                className="group-hover:scale-110 transition-transform"
                            />
                            <span>Share</span>
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
}
