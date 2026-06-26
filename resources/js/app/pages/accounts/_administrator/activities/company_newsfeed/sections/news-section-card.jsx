import React, { useEffect, useState } from "react";
import { Newspaper, Heart, MessageSquare, Share2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@/app/_components/card";
import Badge from "@/app/_components/badge";
import ViewNewsSection from "./view-news-section";
import { get_activity_posts_thunk } from "@/app/redux/activities-slice";

const FALLBACK_IMAGE = "/images/test.jpg";

function stripHtml(html) { return html ? html.replace(/<[^>]+>/g, "").trim() : ""; }
function formatDate(d) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function WysiwygPreview({ html }) {
    return (
        <div
            className="mb-4 line-clamp-2 overflow-hidden text-xs font-medium leading-relaxed text-gray-500 break-words [&_*]:max-w-full [&_a]:break-all [&_a]:text-blue-600 [&_a]:underline [&_b]:font-bold [&_blockquote]:hidden [&_br]:hidden [&_em]:italic [&_h1]:text-sm [&_h1]:font-bold [&_h2]:text-sm [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-bold [&_i]:italic [&_img]:hidden [&_li]:inline [&_ol]:inline [&_ol]:p-0 [&_p]:inline [&_strong]:font-bold [&_table]:hidden [&_ul]:inline [&_ul]:p-0"
            dangerouslySetInnerHTML={{ __html: html ?? "" }}
        />
    );
}

export default function NewsSection() {
    const dispatch = useDispatch();
    const { posts, postsLoading } = useSelector((s) => s.activities);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => { dispatch(get_activity_posts_thunk()); }, [dispatch]);

    const newsItems = posts
        .filter((p) => p.category === "News")
        .map((p) => ({
            id: p.id,
            category: "News",
            image: p.media_url ?? FALLBACK_IMAGE,
            date: formatDate(p.published_at),
            title: p.headline,
            description: stripHtml(p.message),
            contentHtml: p.message,
            likes: 0,
            comments: 0,
        }));

    return (
        <div className="w-full bg-[#f4f6f9] p-6 rounded-2xl min-h-full">
            <div className="flex items-center gap-2 mb-5">
                <Newspaper className="text-[#0f172a]" size={22} />
                <h2 className="text-lg font-bold text-[#0f172a] tracking-tight">
                    Latest News
                </h2>
            </div>

            {postsLoading && newsItems.length === 0 ? (
                <div className="grid grid-cols-2 gap-5">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-64 rounded-2xl bg-white animate-pulse" />
                    ))}
                </div>
            ) : newsItems.length === 0 ? (
                <div className="flex items-center justify-center py-16 text-sm text-gray-400">
                    No news published yet.
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-5">
                    {newsItems.map((item) => (
                        <Card
                            key={item.id}
                            variant="default"
                            padding="p-0"
                            className="col-span-1 overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-md"
                            onClick={() => setSelectedItem(item)}
                        >
                            <div className="relative w-full h-44 bg-gray-100 overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 left-3 mt-3">
                                    <Badge
                                        label={item.category}
                                        variant="info"
                                        className="shadow-sm backdrop-blur-sm"
                                    />
                                </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <span className="text-xs text-gray-400 font-medium block mb-1">
                                        {item.date}
                                    </span>
                                    <h3 className="text-sm font-bold text-gray-900 leading-snug tracking-tight mb-1.5 hover:text-blue-600 cursor-pointer transition-colors">
                                        {item.title}
                                    </h3>
                                    <WysiwygPreview html={item.contentHtml} />
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto text-xs font-semibold text-gray-400">
                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                                            <Heart size={14} className="stroke-[2.5]" />
                                            <span>{item.likes}</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                                            <MessageSquare size={14} className="stroke-[2.5]" />
                                            <span>{item.comments}</span>
                                        </button>
                                    </div>
                                    <button className="flex items-center gap-1 hover:text-gray-600 transition-colors">
                                        <Share2 size={14} className="stroke-[2.5]" />
                                        <span>Share</span>
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <ViewNewsSection
                item={selectedItem}
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
            />
        </div>
    );
}
