import React from "react";
import { Send } from "lucide-react";
import { useSelector } from "react-redux";
import Button from "@/app/_components/button";
import Wysiwyg from "@/app/_components/wysiwyg";

export default function BirthdayEditMessageTab({
    headline,
    onHeadlineChange,
    message,
    onMessageChange,
    onGoPublish,
    submitLabel = "Save & Continue to Publish",
}) {
    const { birthdays, birthdayMonth } = useSelector((state) => state.activities);

    return (
        <div className="flex flex-col gap-4 overflow-x-hidden">

            {/* ── Editor ───────────────────────────────────────── */}
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Post Headline
                    </label>
                    <input
                        type="text"
                        value={headline}
                        onChange={(e) => onHeadlineChange(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Message Body
                    </label>
                    <Wysiwyg value={message} onChange={onMessageChange} />
                </div>
            </div>

            {/* ── Live Preview ─────────────────────────────────── */}
            <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Live Preview
                </p>

                <div className="w-full border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                    <div className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-5 py-4 flex items-center gap-3">
                        <span className="text-2xl">🎂</span>
                        <div>
                            <p className="text-white font-bold text-sm leading-tight">
                                {headline || "Post headline…"}
                            </p>
                            <p className="text-white/70 text-[11px] font-mono tracking-widest mt-0.5">
                                {birthdayMonth} {new Date().getFullYear()}
                            </p>
                        </div>
                    </div>

                    <div className="px-5 py-4 flex flex-col gap-3">
                        <div
                            className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: message || "<p class='text-gray-400'>Your message will appear here…</p>",
                            }}
                        />

                        {birthdays.length > 0 && (
                            <div className="border border-pink-100 bg-pink-50/50 rounded-xl p-3.5 flex flex-col gap-2">
                                <p className="text-xs font-bold text-pink-500 uppercase tracking-wider">
                                    🎂 Birthday Celebrant{birthdays.length !== 1 ? "s" : ""} of the Month
                                </p>
                                <ul className="flex flex-col gap-1">
                                    {birthdays.map((c) => (
                                        <li key={c.user_id} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-800 font-medium">{c.name}</span>
                                            {c.is_today && (
                                                <span className="text-[10px] font-bold bg-pink-200 text-pink-700 px-2 py-0.5 rounded-full">
                                                    Today 🎂
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-1 border-t border-gray-100">
                <Button onClick={onGoPublish}>
                    <Send size={14} className="mr-2" />
                    {submitLabel}
                </Button>
            </div>
        </div>
    );
}

