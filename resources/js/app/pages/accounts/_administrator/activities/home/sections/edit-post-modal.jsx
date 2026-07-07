import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";
import Wysiwyg from "@/app/_components/wysiwyg";
import BirthdayEditMessageTab from "../../department_showcase/sections/birthday-edit-message-tab";
import { update_activity_post_thunk } from "@/app/redux/activities-thunk";

export default function EditPostModal({ post, onClose }) {
    const dispatch = useDispatch();
    const { postUpdating, postUpdateError } = useSelector(
        (state) => state.activities,
    );

    const [headline, setHeadline] = useState("");
    const [message, setMessage] = useState("");
    const [publishTo, setPublishTo] = useState("All Employees");

    // Sync fields whenever a different post is opened
    useEffect(() => {
        if (post) {
            setHeadline(post.headline ?? "");
            setMessage(post.message ?? "");
            setPublishTo(post.publish_to ?? "All Employees");
        }
    }, [post]);

    if (!post) return null;

    const isBirthday = post.type === "birthday";

    async function handleSave() {
        const result = await dispatch(
            update_activity_post_thunk({
                id: post.id,
                data: { headline, message, publish_to: publishTo },
            }),
        );
        if (result.meta.requestStatus === "fulfilled") {
            onClose();
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                    <h2 className="font-semibold text-gray-900 text-base">
                        {isBirthday ? "Edit Birthday Post" : "Edit Post"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition p-1 rounded"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-col gap-4 px-6 py-5 overflow-y-auto">
                    {isBirthday ? (
                        /* ── Birthday: reuse existing BirthdayEditMessageTab ── */
                        <BirthdayEditMessageTab
                            headline={headline}
                            onHeadlineChange={setHeadline}
                            message={message}
                            onMessageChange={setMessage}
                            onGoPublish={handleSave}
                            submitLabel={
                                postUpdating ? "Saving…" : "Save Changes"
                            }
                        />
                    ) : (
                        /* ── General post: simple form ─────────────────────── */
                        <>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Headline
                                </label>
                                <input
                                    type="text"
                                    value={headline}
                                    onChange={(e) =>
                                        setHeadline(e.target.value)
                                    }
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Message
                                </label>
                                <Wysiwyg
                                    value={message}
                                    onChange={(html) => setMessage(html)}
                                />
                            </div>

                            {postUpdateError && (
                                <p className="text-xs text-red-500">
                                    Failed to update post. Please try again.
                                </p>
                            )}
                        </>
                    )}
                </div>
                {!isBirthday && (
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
                        <button
                            onClick={onClose}
                            disabled={postUpdating}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={postUpdating || !headline.trim()}
                            className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition disabled:opacity-50"
                        >
                            {postUpdating ? "Saving…" : "Save Changes"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
