import React, { useEffect, useState } from "react";
import { TbSpeakerphone } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { get_activity_posts_thunk } from "@/app/redux/activities-slice";
import Modal from "@/app/_components/modal";

function stripHtml(html) {
    if (!html) return "";
    const text = html.replace(/<[^>]+>/g, "");

    if (typeof document === "undefined") {
        return text.replace(/&nbsp;/g, " ").trim();
    }

    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value.replace(/\u00a0/g, " ").trim();
}

function formatDate(d) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AnnouncementsSection() {
    const dispatch = useDispatch();
    const { posts, postsLoading } = useSelector((s) => s.activities);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    useEffect(() => { dispatch(get_activity_posts_thunk()); }, [dispatch]);

    const announcements = posts
        .filter((p) => p.category === "Pinned Announcement")
        .map((p) => {
            const fullDescription = stripHtml(p.message);

            return {
                id: p.id,
                title: p.headline,
                description: fullDescription.substring(0, 120) + (fullDescription.length > 120 ? "..." : ""),
                fullDescription,
                date: formatDate(p.published_at),
            };
        });

    return (
        <div className="w-full bg-[#f4f6f9] p-6 rounded-2xl font-sans antialiased">
            <div className="flex items-center gap-2 mb-5">
                <TbSpeakerphone className="text-[#001845]" size={22} />
                <h2 className="text-lg font-bold text-[#001845] tracking-tight">
                    Important Announcements
                </h2>
            </div>

            {postsLoading && announcements.length === 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-36 rounded-xl bg-white animate-pulse" />
                    ))}
                </div>
            ) : announcements.length === 0 ? (
                <div className="flex items-center justify-center py-10 text-sm text-gray-400">
                    No pinned announcements yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                    {announcements.map((a) => (
                        <button
                            key={a.id}
                            type="button"
                            onClick={() => setSelectedAnnouncement(a)}
                            className="w-full text-left bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[140px] relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-[#ff4d4f]" />
                                    <h3 className="text-[15px] font-semibold text-gray-800 leading-tight">
                                        {a.title}
                                    </h3>
                                </div>
                                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md whitespace-nowrap bg-[#fff1f0] text-[#ff4d4f]">
                                    Pinned
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed font-normal mb-4">
                                {a.description}
                            </p>
                            <div className="flex items-center gap-3 text-[11px] text-gray-400">
                                <span>{a.date}</span>
                                <span className="bg-[#f0f2f5] text-gray-500 px-2 py-0.5 rounded font-normal">
                                    Announcement
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            <Modal
                isOpen={Boolean(selectedAnnouncement)}
                onClose={() => setSelectedAnnouncement(null)}
                title={
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#ff4d4f]">
                            <TbSpeakerphone size={21} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                                Activities / Company NewsFeed
                            </p>
                            <h2 className="mt-1 text-base font-semibold text-gray-900">
                                Announcement Details
                            </h2>
                        </div>
                    </div>
                }
                width="max-w-2xl h-max"
            >
                {selectedAnnouncement && (
                    <div className="overflow-x-hidden border-t border-gray-100 pt-5">
                        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span className="rounded-full bg-red-50 px-2.5 py-1 font-medium text-[#ff4d4f]">
                                Pinned
                            </span>
                            <span>{selectedAnnouncement.date}</span>
                        </div>

                        <h3 className="mb-4 text-xl font-bold leading-snug text-gray-900 break-words">
                            {selectedAnnouncement.title}
                        </h3>

                        <div className="max-h-[52vh] overflow-y-auto overflow-x-hidden pr-2 text-sm leading-7 text-gray-600 whitespace-pre-line break-words">
                            {selectedAnnouncement.fullDescription}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
