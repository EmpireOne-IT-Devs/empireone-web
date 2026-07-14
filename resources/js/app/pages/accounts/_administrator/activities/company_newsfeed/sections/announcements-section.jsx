import React, { useEffect, useState } from "react";
import {
    TbSpeakerphone,
    TbPin,
    TbCalendar,
    TbX,
    TbChevronRight,
} from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { get_engagement_posts_thunk } from "@/app/redux/engagement-thunk";
import Modal from "@/app/_components/modal";
import Skeleton from "@/app/_components/skeleton";

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
    return new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

const ACCENT_COLORS = [
    { bar: "#f59e0b", bg: "#fffbeb", text: "#b45309" },
    { bar: "#3b82f6", bg: "#eff6ff", text: "#1d4ed8" },
    { bar: "#10b981", bg: "#ecfdf5", text: "#065f46" },
    { bar: "#8b5cf6", bg: "#f5f3ff", text: "#5b21b6" },
];

function WysiwygContent({ html }) {
    return (
        <div
            className="max-h-[52vh] overflow-y-auto overflow-x-hidden pr-2 text-[13.5px] leading-7 text-gray-600 break-words [&_*]:max-w-full [&_a]:break-all [&_a]:text-blue-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_b]:font-bold [&_em]:italic [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_i]:italic [&_img]:my-3 [&_img]:rounded-xl [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_strong]:font-bold [&_strong]:text-gray-800 [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-gray-200 [&_td]:p-2 [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:p-2 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: html ?? "" }}
        />
    );
}

function AnnouncementCard({ announcement, index, onClick }) {
    const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

    return (
        <button
            type="button"
            onClick={onClick}
            className="announcement-card group w-full text-left relative bg-white rounded-2xl overflow-hidden border border-gray-100/80"
            style={{ "--accent-bar": accent.bar }}
        >
            <span
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                style={{ background: accent.bar }}
                aria-hidden="true"
            />

            <div className="pl-5 pr-5 pt-5 pb-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                        <span
                            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md"
                            style={{ background: accent.bg }}
                            aria-hidden="true"
                        >
                            <TbPin size={12} style={{ color: accent.bar }} />
                        </span>
                        <h3 className="text-[14px] font-semibold text-gray-900 leading-snug line-clamp-2">
                            {announcement.title}
                        </h3>
                    </div>

                    <span
                        className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mt-0.5"
                        style={{ background: accent.bg, color: accent.text }}
                    >
                        Pinned
                    </span>
                </div>

                <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-3 mb-4">
                    {announcement.description}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <TbCalendar size={12} />
                        <span>{announcement.date}</span>
                    </div>
                    <span
                        className="flex items-center gap-1 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ color: accent.bar }}
                    >
                        Read more
                        <TbChevronRight size={12} />
                    </span>
                </div>
            </div>

            <style>{`
                .announcement-card {
                    box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
                    transition: box-shadow 0.2s ease, transform 0.2s ease;
                }
                .announcement-card:hover {
                    box-shadow: 0 8px 24px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06);
                    transform: translateY(-2px);
                }
                .announcement-card:focus-visible {
                    outline: 2px solid var(--accent-bar);
                    outline-offset: 2px;
                }
            `}</style>
        </button>
    );
}

export default function AnnouncementsSection() {
    const dispatch = useDispatch();
    const { posts, postsLoading } = useSelector((s) => s.engagement);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);

    useEffect(() => {
        dispatch(get_engagement_posts_thunk());
    }, [dispatch]);

    const postArray = Array.isArray(posts) ? posts : [];

    const announcements = postArray
        .filter((p) => p.category === "Pinned Announcement" || p.category === "Announcement")
        .map((p) => {
            const rawMessage = p.message || p.content || "";
            const rawTitle = p.headline || p.title || "Untitled Announcement";
            const fullDescription = stripHtml(rawMessage);
            
            return {
                id: p.id,
                title: rawTitle,
                image: p.files?.[0]?.url || p.media_url || null,
                description:
                    fullDescription.substring(0, 130) +
                    (fullDescription.length > 130 ? "…" : ""),
                fullDescription,
                contentHtml: rawMessage,
                date: formatDate(p.published_at || p.created_at),
            };
        });

    const handleOpen = (announcement, index) => {
        setSelectedAnnouncement(announcement);
        setSelectedIndex(index);
    };

    const modalAccent =
        selectedIndex !== null
            ? ACCENT_COLORS[selectedIndex % ACCENT_COLORS.length]
            : ACCENT_COLORS[0];

    return (
        <div className="w-full bg-[#f0f2f7] p-6 rounded-2xl font-sans antialiased">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center">
                        <TbSpeakerphone className="text-black" size={28} />
                    </div>
                    <div>
                        <h2 className="text-[15px] font-bold text-[#001845] tracking-tight leading-none">
                            Announcements
                        </h2>
                        {announcements.length > 0 && (
                            <p className="text-[11px] text-gray-400 mt-0.5">
                                {announcements.length} pinned{" "}
                                {announcements.length === 1 ? "item" : "items"}
                            </p>
                        )}
                    </div>
                </div>

                {announcements.length > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#001845] text-[10px] font-bold text-white">
                        {announcements.length}
                    </span>
                )}
            </div>

            {postsLoading && announcements.length === 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100/80 p-5 h-40">
                        <Skeleton />
                    </div>
                    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100/80 p-5 h-40">
                        <Skeleton />
                    </div>
                </div>
            ) : announcements.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white mb-3 shadow-sm">
                        <TbSpeakerphone size={22} className="text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-400">
                        No announcements yet
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                        Pinned items will appear here
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-4 items-start">
                    {announcements.map((a, i) => (
                        <AnnouncementCard
                            key={a.id}
                            announcement={a}
                            index={i}
                            onClick={() => handleOpen(a, i)}
                        />
                    ))}
                </div>
            )}

            <Modal
                isOpen={Boolean(selectedAnnouncement)}
                onClose={() => {
                    setSelectedAnnouncement(null);
                    setSelectedIndex(null);
                }}
                title={
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                            <TbSpeakerphone size={20} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                                Company NewsFeed
                            </p>
                            <h2 className="mt-0.5 text-base font-semibold text-gray-900 leading-tight">
                                Announcement
                            </h2>
                        </div>
                    </div>
                }
                width="max-w-2xl h-max"
            >
                {selectedAnnouncement && (
                    <div className="border-t border-gray-100 pt-5 overflow-x-hidden">
                        <div className="flex flex-wrap items-center gap-2 mb-5">
                            <span
                                className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                                style={{
                                    background: modalAccent.bg,
                                    color: modalAccent.text,
                                }}
                            >
                                <TbPin size={11} />
                                Pinned
                            </span>
                            <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-500">
                                <TbCalendar size={11} />
                                {selectedAnnouncement.date}
                            </span>
                        </div>

                        <h3
                            className="mb-5 text-xl font-bold leading-snug text-gray-900 break-words pb-4 border-b border-gray-100"
                            style={{
                                borderLeftWidth: "3px",
                                borderLeftColor: modalAccent.bar,
                                borderLeftStyle: "solid",
                                paddingLeft: "12px",
                            }}
                        >
                            {selectedAnnouncement.title}
                        </h3>
                        {selectedAnnouncement.image && (
                            <div className="mb-5 overflow-hidden rounded-2xl border border-gray-100 bg-gray-100">
                                <img
                                    src={selectedAnnouncement.image}
                                    alt={selectedAnnouncement.title}
                                    className="max-h-80 w-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.parentElement.style.display = "none";
                                    }}
                                />
                            </div>
                        )}

                        <WysiwygContent html={selectedAnnouncement.contentHtml} />
                    </div>
                )}
            </Modal>
        </div>
    );
}