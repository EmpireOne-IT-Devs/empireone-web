import React, { useEffect, useState } from "react";
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
    const [expanded, setExpanded] = useState(false);

    const handleSendComment = (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setComment("");
    };

    const description = item?.description ?? "";
    const contentHtml = item?.contentHtml ?? description;
    const isLong = description.length > 220;

    useEffect(() => {
        setExpanded(false);
    }, [item?.id]);

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
                <div className="flex flex-col gap-5 overflow-x-hidden">
                    {/* Hero Image */}
                    <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-2xl bg-gray-200">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-5 left-6 right-6">
                            <div className="flex items-center gap-3 mb-2">
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
                            <h2 className="text-white font-bold text-xl md:text-2xl leading-snug tracking-tight">
                                {item.title}
                            </h2>
                        </div>
                    </div>

                    {/* Article Body */}
                    <div className="flex-1">
                        {/* Author Metadata */}
                        <div className="mb-5 flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
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

                        {/* Full Content with view more/less */}
                        <div className="prose prose-sm max-w-none overflow-x-hidden">
                            <div className="relative">
                                <div
                                    className={`overflow-x-hidden text-sm leading-7 text-gray-600 break-words [&_*]:max-w-full [&_a]:break-all [&_a]:text-blue-600 [&_a]:underline [&_b]:font-bold [&_strong]:font-bold [&_strong]:text-gray-800 [&_em]:italic [&_i]:italic [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 ${
                                        isLong && !expanded
                                            ? "max-h-32 overflow-hidden"
                                            : ""
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                                />
                                {isLong && !expanded && (
                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-white/0" />
                                )}
                            </div>
                            {isLong && (
                                <button
                                    type="button"
                                    onClick={() => setExpanded((prev) => !prev)}
                                    className="mt-3 inline-flex items-center justify-center rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-100"
                                >
                                    {expanded ? "Show less" : "Read full article"}
                                </button>
                            )}
                        </div>

                        <hr className="border-gray-100 my-5" />

                        <form
                            onSubmit={handleSendComment}
                            className="relative flex items-center p-2"
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
                                <Send size={16} className="m-2"/>
                            </button>
                        </form>
                    </div>

                    {/* Footer Actions Panel */}
                    <div className="flex items-center justify-between gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
                        <div className="flex items-center gap-1">
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
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all group">
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
