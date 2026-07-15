import React, { useState } from "react";
import { Cake, Gift } from "lucide-react";
import { useSelector } from "react-redux";
import Modal from "@/app/_components/modal";
import Button from "@/app/_components/button";
import CreateBirthdayPost from "./create-birthday-post";

// Deterministic color palette — assigned by index so colors are consistent per render
const COLOR_PALETTE = [
    { color: "bg-pink-500",   pillBg: "bg-gradient-to-r from-pink-500 to-rose-500" },
    { color: "bg-blue-600",   pillBg: "bg-gradient-to-r from-blue-600 to-indigo-600" },
    { color: "bg-purple-600", pillBg: "bg-gradient-to-r from-purple-600 to-fuchsia-600" },
    { color: "bg-orange-500", pillBg: "bg-gradient-to-r from-orange-500 to-amber-500" },
    { color: "bg-teal-600",   pillBg: "bg-gradient-to-r from-teal-600 to-emerald-600" },
    { color: "bg-amber-500",  pillBg: "bg-gradient-to-r from-amber-500 to-orange-500" },
    { color: "bg-indigo-600", pillBg: "bg-gradient-to-r from-indigo-600 to-blue-600" },
];

export default function ViewBirthdaySection() {
    const [isOpen, setIsOpen] = useState(false);

    // Selected state from the engagement slice
    const { birthdays, birthdayMonth, birthdayCount } = useSelector(
        (state) => state.engagement
    );

    const birthdayList = birthdays ?? [];
    const displayCount = birthdayCount ?? birthdayList.length;
    const currentYear = new Date().getFullYear();
    const displayMonth = birthdayMonth || new Date().toLocaleString("default", { month: "long" });

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                <Gift size={16} className="mr-2" />
                View All
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                width="max-w-2xl"
                title={
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600 shrink-0">
                            <Cake size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                                Activities / Department Showcase
                            </p>
                            <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                {displayMonth} Birthdays
                            </h2>
                        </div>
                    </div>
                }
            >
                <div className="w-full flex flex-col font-sans antialiased">
                    <div className="pb-3">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                            <span>🗓️</span> {displayMonth} {currentYear} - Birthday List
                        </div>
                    </div>
                    <p className="text-[12px] text-neutral-500 font-medium mt-1">
                        {displayCount} celebrant{displayCount !== 1 ? "s" : ""} this month
                    </p>

                    {/* Empty state */}
                    {birthdayList.length === 0 && (
                        <div className="flex items-center justify-center py-12 text-sm text-gray-400">
                            No birthdays this month.
                        </div>
                    )}

                    {/* List */}
                    <div className="flex flex-col gap-2.5 max-h-[600px] overflow-y-auto pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                        {birthdayList.map((user, idx) => {
                            const palette = COLOR_PALETTE[idx % COLOR_PALETTE.length];
                            return (
                                <div
                                    key={user.user_id}
                                    className="flex items-center justify-between p-3 bg-white hover:bg-gray-50/50 border border-gray-100 rounded-2xl transition-all duration-150 shadow-sm"
                                >
                                    {/* Left: index + avatar + name */}
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <span className="w-4 text-center text-xs font-bold text-gray-400">
                                            {idx + 1}
                                        </span>

                                        <div className="relative shrink-0">
                                            {user.profile_picture || user.avatar ? (
                                                <img
                                                    src={user.profile_picture ?? user.avatar}
                                                    alt={user.name}
                                                    className="w-10 h-10 rounded-full object-cover shadow-sm"
                                                />
                                            ) : (
                                                <div className={`w-10 h-10 rounded-full ${palette.color} flex items-center justify-center text-white font-bold text-xs tracking-wide shadow-sm`}>
                                                    {user.initials}
                                                </div>
                                            )}
                                            <div className={`absolute -bottom-1 -right-1 ${user.is_today ? "bg-[#ff4b91]" : "bg-pink-500"} text-white p-0.5 rounded-full ring-2 ring-white shadow-sm flex items-center justify-center`}>
                                                <Cake size={8} className="stroke-[2.5]" />
                                            </div>
                                        </div>

                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-bold text-gray-800 tracking-tight truncate">
                                                {user.name}
                                            </span>
                                            <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                                                {user.department ?? "General"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="shrink-0 pl-2">
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold text-white px-3 py-1 rounded-full shadow-sm tracking-wide uppercase ${user.is_today ? "bg-gradient-to-r from-pink-500 to-rose-500" : palette.pillBg}`}>
                                            🎂 {user.birthday_label || "This Month"}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="mt-4 gap-2 flex justify-end">
                    <CreateBirthdayPost />
                    <Button variant="danger" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                </div>
            </Modal>
        </>
    );
}