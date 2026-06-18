import React, { useState } from "react";
import { Image, Video, BarChart3, User, Send } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Wysiwyg from "@/app/_components/wysiwyg";
import {
    publish_activity_post_thunk,
    get_activity_posts_thunk,
    get_upcoming_events_thunk,
} from "@/app/redux/activities-slice";

export default function CreatePostCardSection() {
    const dispatch = useDispatch();
    const { publishing } = useSelector((state) => state.activities);

    const [headline, setHeadline] = useState("");
    const [message, setMessage] = useState("");
    const [publishTo, setPublishTo] = useState("All Employees");
    const [scheduledAt, setScheduledAt] = useState("");
    const [expanded, setExpanded] = useState(false);

    const plainText = message.replace(/<[^>]+>/g, "").trim();

    const resetForm = () => {
        setHeadline("");
        setMessage("");
        setPublishTo("All Employees");
        setScheduledAt("");
        setExpanded(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!plainText) return;

        const result = await dispatch(
            publish_activity_post_thunk({
                type: "general",
                headline: headline.trim() || "General Update",
                message,
                month: null,
                year: null,
                publish_to: publishTo,
                scheduled_at: scheduledAt || null,
            })
        );

        if (publish_activity_post_thunk.fulfilled.match(result)) {
            await dispatch(get_activity_posts_thunk());
            await dispatch(get_upcoming_events_thunk());
            resetForm();
        }
    };

    return (
        <div className="w-full font-sans flex flex-col gap-3">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center shadow-sm">
                        <User className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1">
                        {!expanded ? (
                            <button
                                type="button"
                                onClick={() => setExpanded(true)}
                                className="w-full text-left bg-slate-100 rounded-full px-4 py-2.5 text-sm text-slate-500 border border-transparent hover:bg-slate-50 hover:border-slate-200 transition-all"
                            >
                                Share an update with the floor...
                            </button>
                        ) : (
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <input
                                    type="text"
                                    value={headline}
                                    onChange={(e) => setHeadline(e.target.value)}
                                    placeholder="Post headline"
                                    className="w-full mb-3 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                                />

                                <Wysiwyg
                                    value={message}
                                    onChange={setMessage}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                    <select
                                        value={publishTo}
                                        onChange={(e) => setPublishTo(e.target.value)}
                                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                                    >
                                        <option>All Employees</option>
                                        <option>Department Only</option>
                                        <option>Management</option>
                                    </select>

                                    <input
                                        type="datetime-local"
                                        value={scheduledAt}
                                        onChange={(e) => setScheduledAt(e.target.value)}
                                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-center pl-[52px]">
                    <div className="flex items-center gap-5">
                        <button type="button" className="flex items-center gap-1.5 text-slate-500 hover:text-violet-600 text-sm font-medium transition-colors group">
                            <Image className="w-4 h-4 text-slate-400 group-hover:text-violet-500 transition-colors" />
                            <span>Photo</span>
                        </button>

                        <button type="button" className="flex items-center gap-1.5 text-slate-500 hover:text-violet-600 text-sm font-medium transition-colors group">
                            <Video className="w-4 h-4 text-slate-400 group-hover:text-violet-500 transition-colors" />
                            <span>Video</span>
                        </button>

                        <button type="button" className="flex items-center gap-1.5 text-slate-500 hover:text-violet-600 text-sm font-medium transition-colors group">
                            <BarChart3 className="w-4 h-4 text-slate-400 group-hover:text-violet-500 transition-colors" />
                            <span>Poll</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        {expanded && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="text-slate-500 hover:text-slate-700 text-sm font-medium"
                            >
                                Cancel
                            </button>
                        )}

                        {plainText && (
                            <button
                                type="submit"
                                disabled={publishing}
                                className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-medium text-xs py-1.5 px-3.5 rounded-full shadow-sm transition-all"
                            >
                                <span>{scheduledAt ? "Schedule" : "Post"}</span>
                                <Send className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}