import React, { useState, useRef, useEffect, useMemo } from "react";
import {
    Image,
    Video,
    BarChart3,
    User,
    Send,
    FileText,
    CalendarDays,
    Newspaper,
    Megaphone,
    Tag,
    Plus,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";
import Modal from "@/app/_components/modal";
import Button from "@/app/_components/button";
import Wysiwyg from "@/app/_components/wysiwyg";
import {
    publish_activity_post_thunk,
    get_activity_posts_thunk,
    get_upcoming_events_thunk,
} from "@/app/redux/activities-thunk";
import { FaPaperPlane } from "react-icons/fa";

const POST_TABS = [
    { id: "post", label: "Post", icon: FileText },
    { id: "photo", label: "Photo", icon: Image },
    { id: "video", label: "Video", icon: Video },
    { id: "poll", label: "Poll", icon: BarChart3 },
];

const CATEGORIES = [
    { id: "Pinned Announcement", icon: Megaphone },
    { id: "Events", icon: CalendarDays },
    { id: "News", icon: Newspaper },
    { id: "Milestone", icon: Send },
    { id: "General", icon: Tag },
];

export default function CreatePostCardSection() {
    const dispatch = useDispatch();
    const { publishing, publishError } = useSelector((state) => state.activities);

    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("post");
    const [selectedCategory, setSelectedCategory] = useState("General");
    const [headline, setHeadline] = useState("");
    const [message, setMessage] = useState("");
    const [pollQuestion, setPollQuestion] = useState("");
    const [pollOptions, setPollOptions] = useState(["", ""]);
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaDragging, setMediaDragging] = useState(false);
    const fileInputRef = useRef(null);
    const mediaPreviewUrl = useMemo(
        () => (mediaFile ? URL.createObjectURL(mediaFile) : null),
        [mediaFile],
    );
    useEffect(() => {
        return () => { if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl); };
    }, [mediaPreviewUrl]);

    const plainText = message.replace(/<[^>]+>/g, "").trim();
    const pollQuestionText = pollQuestion.replace(/<[^>]+>/g, "").trim();
    const filledPollOptions = pollOptions
        .map((option) => option.trim())
        .filter(Boolean);
    const canPublish =
        activeTab === "poll"
            ? Boolean(
                  headline.trim() &&
                  pollQuestionText &&
                  filledPollOptions.length >= 2,
              )
            : activeTab === "photo" || activeTab === "video"
              ? Boolean(headline.trim() && plainText && mediaFile)
              : Boolean(headline.trim() && plainText);

    // Switch tabs and clear any uploaded media (wrong type for the new tab).
    const handleTabChange = (tabId) => {
        if (tabId !== activeTab) {
            setMediaFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
        setActiveTab(tabId);
    };

    const openComposer = (tab = "post") => {
        handleTabChange(tab);
        setIsOpen(true);
    };

    const closeComposer = () => {
        setIsOpen(false);
    };

    const resetForm = () => {
        setIsOpen(false);
        setActiveTab("post");
        setSelectedCategory("General");
        setHeadline("");
        setMessage("");
        setPollQuestion("");
        setPollOptions(["", ""]);
        setMediaFile(null);
        setMediaDragging(false);
    };

    const updatePollOption = (index, value) => {
        setPollOptions((prev) =>
            prev.map((option, optionIndex) =>
                optionIndex === index ? value : option,
            ),
        );
    };

    const addPollOption = () => {
        setPollOptions((prev) => [...prev, ""]);
    };

    const buildMessagePayload = () => {
        if (activeTab === "poll") {
            // The question HTML is stored in `message`. Options go to the
            // `options[]` field — not embedded in the message body.
            return pollQuestion;
        }

        return message;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canPublish) return;

        const result = await dispatch(
            publish_activity_post_thunk({
                type: activeTab === "poll" ? "poll" : "general",
                category: selectedCategory,
                headline: headline.trim(),
                message: buildMessagePayload(),
                // Poll options are sent as a separate array field,
                // not encoded in the message body.
                ...(activeTab === "poll" && { options: filledPollOptions }),
                month: null,
                year: null,
                publish_to: "All Employees",
                scheduled_at: null,
                media: mediaFile ?? undefined,
            }),
        );

        if (publish_activity_post_thunk.fulfilled.match(result)) {
            await dispatch(get_activity_posts_thunk());
            await dispatch(get_upcoming_events_thunk());
            dispatch(setAlert({ type: "success", title: "Post Published Successfully!" }));
            resetForm();
        }
    };

    const renderTabButton = ({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;

        return (
            <button
                key={id}
                type="button"
                onClick={() => handleTabChange(id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                        ? "bg-white text-indigo-700 shadow-[0_2px_8px_rgba(15,23,42,0.12)]"
                        : "text-slate-500 hover:text-slate-700"
                }`}
            >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
            </button>
        );
    };

    const renderCategoryButton = ({ id, icon: Icon }) => {
        const isActive = selectedCategory === id;

        return (
            <button
                key={id}
                type="button"
                onClick={() => setSelectedCategory(id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                        ? "border-slate-500 bg-white text-slate-800 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.25)]"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
            >
                <Icon className="h-3.5 w-3.5" />
                <span>{id}</span>
            </button>
        );
    };

    const handleFileSelect = (file) => {
        if (!file) return;
        const isVideo = activeTab === "video";
        const allowed = isVideo
            ? ["video/mp4", "video/quicktime", "video/webm"]
            : ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!allowed.includes(file.type)) return;
        setMediaFile(file);
    };

    const renderUploadBox = (type) => {
        const isVideo = type === "video";
        const Icon = isVideo ? Video : Image;
        const accept = isVideo ? "video/mp4,video/quicktime,video/webm" : "image/jpeg,image/png,image/gif,image/webp";
        const preview = mediaPreviewUrl;

        return (
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                    {isVideo ? "Video" : "Photo"} *
                </label>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
                />

                {mediaFile && preview ? (
                    <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-black">
                        {isVideo ? (
                            <video
                                src={preview}
                                controls
                                className="w-full max-h-64 object-contain"
                            />
                        ) : (
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full max-h-64 object-contain"
                            />
                        )}
                        <button
                            type="button"
                            onClick={() => { setMediaFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                            className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition text-xs font-bold"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setMediaDragging(true); }}
                        onDragLeave={() => setMediaDragging(false)}
                        onDrop={(e) => {
                            e.preventDefault();
                            setMediaDragging(false);
                            handleFileSelect(e.dataTransfer.files?.[0] ?? null);
                        }}
                        className={`flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed px-6 py-10 text-center transition-all ${
                            mediaDragging
                                ? "border-indigo-400 bg-indigo-50"
                                : "border-slate-300 bg-white hover:border-indigo-300 hover:bg-slate-50"
                        }`}
                    >
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <Icon className="h-7 w-7" />
                        </div>
                        <p className="text-base font-medium text-slate-600">
                            Drag & drop or click to upload
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                            {isVideo ? "MP4, MOV, WEBM — max 50 MB" : "JPG, PNG, GIF, WEBP — max 50 MB"}
                        </p>
                    </div>
                )}
            </div>
        );
    };

    const renderFormBody = () => {
        if (activeTab === "poll") {
            return (
                <>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            placeholder="Enter a title..."
                            className="w-full rounded-3xl border border-slate-200 px-5 py-3.5 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Question / Description *
                        </label>
                        <Wysiwyg
                            value={pollQuestion}
                            onChange={setPollQuestion}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-semibold text-slate-700">
                            Poll Options *
                        </label>
                        {pollOptions.map((option, index) => (
                            <input
                                key={index}
                                type="text"
                                value={option}
                                onChange={(e) =>
                                    updatePollOption(index, e.target.value)
                                }
                                placeholder={`Option ${index + 1}`}
                                className="w-full rounded-3xl border border-slate-200 px-5 py-3.5 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                            />
                        ))}

                        <button
                            type="button"
                            onClick={addPollOption}
                            className="inline-flex items-center gap-2 self-start text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add option</span>
                        </button>
                    </div>
                </>
            );
        }

        return (
            <>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="Enter a title..."
                        className="w-full rounded-3xl border border-slate-200 px-5 py-3.5 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">
                        {activeTab === "post" ? "Content *" : "Caption *"}
                    </label>
                    <Wysiwyg
                        value={message}
                        onChange={setMessage}
                    />
                </div>

                {activeTab === "photo" && renderUploadBox("photo")}
                {activeTab === "video" && renderUploadBox("video")}
            </>
        );
    };

    return (
        <div className="flex w-full flex-col gap-3 font-sans">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 shadow-sm">
                        <User className="h-5 w-5 text-white" />
                    </div>

                    <button
                        type="button"
                        onClick={() => openComposer("post")}
                        className="w-full rounded-full border border-transparent bg-slate-100 px-4 py-3 text-left text-sm text-slate-500 transition-all hover:border-slate-200 hover:bg-slate-50"
                    >
                        Share an update with the floor...
                    </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                    {POST_TABS.slice(1).map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => openComposer(id)}
                            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600"
                        >
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={isOpen}
                onClose={closeComposer}
                 title={
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
                                            <FaPaperPlane size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                                                Activities / Home
                                            </p>
                                            <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                               Create New Post
                                            </h2>
                                          
                                        </div>
                                    </div>
                                }

                width="max-w-4xl"
            >
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6 px-1 pb-1 p-6"
                >
                    <div className="rounded-[28px] bg-slate-100 p-1.5">
                        <div className="flex flex-wrap gap-1.5">
                            {POST_TABS.map(renderTabButton)}
                        </div>
                    </div>

                    {activeTab !== "poll" && (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">
                                Category
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(renderCategoryButton)}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-5">
                        {renderFormBody()}
                    </div>

                    {publishError && (
                        <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                            {typeof publishError === "string"
                                ? publishError
                                : publishError?.message ?? "Failed to publish. Please try again."}
                        </div>
                    )}

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                                <FileText className="h-3.5 w-3.5" />
                                <span>Company Newsfeed</span>
                            </div>
                            {activeTab !== "poll" && (
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                                    <Tag className="h-3.5 w-3.5" />
                                    <span>{selectedCategory}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="light"
                                outlined
                                onClick={resetForm}
                                className="rounded-full border-slate-300 px-5 text-slate-600"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!canPublish}
                                loading={publishing}
                                className="gap-2 rounded-full bg-indigo-700 px-6 text-white hover:bg-indigo-800"
                            >
                                {!publishing && <Send className="h-4 w-4" />}
                                <span>Publish Post</span>
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
