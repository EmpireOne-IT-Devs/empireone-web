import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { router } from "@inertiajs/react";
import { publish_activity_post_thunk } from "@/app/redux/activities-slice";

import Button from "@/app/_components/button";
export default function BirthdayPublishTab({ headline, message, onClose }) {
    const dispatch = useDispatch();
    const { birthdayMonth, publishing, birthdays } = useSelector(
        (state) => state.activities,
    );

    const [publishTo, setPublishTo] = useState("All Employees");
    const [scheduledAt, setScheduledAt] = useState("");

    const navigate = () => {
        onClose();
        router.visit("/accounts/administrator/activities/home");
    };

    const handlePublishNow = async () => {
        const result = await dispatch(
            publish_activity_post_thunk({
                type: "birthday",
                headline,
                message,
                month: birthdayMonth,
                year: new Date().getFullYear(),
                publish_to: publishTo,
                scheduled_at: null,
            }),
        );
        if (publish_activity_post_thunk.fulfilled.match(result)) navigate();
    };

    const handleSchedule = async () => {
        const result = await dispatch(
            publish_activity_post_thunk({
                type: "birthday",
                headline,
                message,
                month: birthdayMonth,
                year: new Date().getFullYear(),
                publish_to: publishTo,
                scheduled_at: scheduledAt,
            }),
        );
        if (publish_activity_post_thunk.fulfilled.match(result)) navigate();
    };

    return (
        <div className="flex flex-col gap-4 p-2">
            {/* ── Post Preview ─────────────────────────────────────── */}
            <div className="w-full border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                {/* Banner */}
                <div className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-5 py-4 flex items-center gap-3">
                    <span className="text-2xl">🎂</span>
                    <div>
                        <p className="text-white font-bold text-sm leading-tight">
                            {headline}
                        </p>
                        <p className="text-white/70 text-[11px] font-mono tracking-widest mt-0.5">
                            {birthdayMonth} {new Date().getFullYear()}
                        </p>
                    </div>
                </div>

                {/* Body */}
                <div className="px-5 py-4 flex flex-col gap-3">
                    <div
                        className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: message }}
                    />

                    {birthdays.length > 0 && (
                        <div className="border border-pink-100 bg-pink-50/50 rounded-xl p-3.5 flex flex-col gap-2">
                            <p className="text-xs font-bold text-pink-500 uppercase tracking-wider">
                                🎂 Birthday Celebrant
                                {birthdays.length !== 1 ? "s" : ""} of the Month
                            </p>
                            <ul className="flex flex-col gap-1">
                                {birthdays.map((c) => (
                                    <li
                                        key={c.user_id}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-sm text-gray-800 font-medium">
                                            {c.name}
                                        </span>
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

            {/* ── Publish controls ─────────────────────────────────── */}
            <div className="flex flex-col gap-3 border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Schedule{" "}
                        <span className="normal-case font-normal text-gray-400">
                            (leave blank to publish now)
                        </span>
                    </label>
                    <input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition bg-white"
                    />
                </div>
                <div className="flex justify-end items-center pt-1 gap-2">
                    <Button onClick={onClose} disabled={publishing}>
                        Cancel
                    </Button>
                    <div className="flex items-center gap-2">
                        {scheduledAt && (
                            <Button
                                variant="outlined"
                                onClick={handleSchedule}
                                disabled={publishing}
                                className="gap-2"
                            >
                                {publishing ? (
                                    <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                                ) : (
                                    <FaPaperPlane size={11} />
                                )}
                                {publishing ? "Scheduling…" : "Schedule"}
                            </Button>
                        )}
                        <Button
                            onClick={handlePublishNow}
                            disabled={publishing}
                            className="bg-pink-500 hover:bg-pink-600 text-white gap-2"
                        >
                            {publishing ? (
                                <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                                <FaPaperPlane size={11} />
                            )}
                            {publishing ? "Publishing…" : "Publish Now"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
