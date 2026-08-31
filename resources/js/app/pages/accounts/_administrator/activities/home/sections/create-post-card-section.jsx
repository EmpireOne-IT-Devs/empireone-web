import React, { useRef, useState, useEffect } from "react";
import {
    Send,
    CalendarDays,
    Newspaper,
    Megaphone,
    User,
    ImagePlus,
    X,
    Tag,
    BarChart2,
    Plus,
    Trash2,
    ChevronDown,
    Clock,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { setAlert } from "@/app/redux/app-slice";
import Modal from "@/app/_components/modal";
import Button from "@/app/_components/button";
import Wysiwyg from "@/app/_components/wysiwyg";
import {
    create_engagement_post_thunk,
    get_engagement_posts_thunk,
    publish_engagement_post_thunk,
} from "@/app/redux/engagement-slice";
import { FaPaperPlane } from "react-icons/fa";

const POST_TYPES = [
    { id: "post", label: "Post", icon: Tag },
    { id: "poll", label: "Poll", icon: BarChart2 },
];

const CATEGORIES = [
    { id: "Event", icon: CalendarDays },
    { id: "News", icon: Newspaper },
    { id: "Milestone", icon: Send },
    { id: "Announcement", icon: Megaphone },
];

export default function CreatePostCardSection() {
    const dispatch = useDispatch();
    const { creating, publishing } = useSelector((state) => state.engagement);

    const [isOpen, setIsOpen] = useState(false);
    const [postType, setPostType] = useState("post");
    const [selectedCategory, setSelectedCategory] = useState("Event");
    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [pollOptions, setPollOptions] = useState(["", ""]);
    const fileInputRef = useRef(null);

    // Schedule Publish state
    const [publishMode, setPublishMode] = useState("now"); // "now" | "schedule"
    const [showPublishMenu, setShowPublishMenu] = useState(false);
    const [showScheduler, setShowScheduler] = useState(false);
    const [scheduledAt, setScheduledAt] = useState(""); // datetime-local value
    const [scheduleError, setScheduleError] = useState("");
    const publishMenuRef = useRef(null);

    // Close the publish options menu on outside click
    useEffect(() => {
        if (!showPublishMenu) return;
        function handleOutside(e) {
            if (
                publishMenuRef.current &&
                !publishMenuRef.current.contains(e.target)
            ) {
                setShowPublishMenu(false);
            }
        }
        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, [showPublishMenu]);

    const validateSchedule = () => {
        if (!scheduledAt) {
            setScheduleError("Please select a date and time.");
            return false;
        }
        if (new Date(scheduledAt).getTime() <= Date.now()) {
            setScheduleError("Scheduled time must be in the future.");
            return false;
        }
        setScheduleError("");
        return true;
    };

    const confirmSchedule = () => {
        if (!validateSchedule()) return;
        setPublishMode("schedule");
        setShowScheduler(false);
    };

    const cancelSchedule = () => {
        setPublishMode("now");
        setScheduledAt("");
        setScheduleError("");
        setShowScheduler(false);
    };

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: { title: "", content: "" },
    });

    // Register custom content field for proper react-hook-form validation
    useEffect(() => {
        register("content", { required: "Content is required" });
    }, [register]);

    const content = watch("content");
    const title = watch("title");

    // Memoize object URLs to prevent infinite recreations and memory leaks
    const [previewUrls, setPreviewUrls] = useState([]);

    useEffect(() => {
        // Create previews
        const urls = images.map((img) => URL.createObjectURL(img));
        setPreviewUrls(urls);

        // Cleanup function to revoke URLs when images change or component unmounts
        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [images]);

    const canPublish =
        (postType === "poll"
            ? title?.trim() &&
              pollOptions.filter((o) => o.trim()).length >= 2
            : title?.trim() &&
              (content ?? "").replace(/<[^>]+>/g, "").trim()) &&
        (publishMode !== "schedule" || Boolean(scheduledAt));

    const resetForm = () => {
        reset();
        setPostType("post");
        setSelectedCategory("Event");
        setImages([]);
        setPollOptions(["", ""]);
        setPublishMode("now");
        setScheduledAt("");
        setScheduleError("");
        setShowScheduler(false);
        setShowPublishMenu(false);
        setIsOpen(false);
    };

    const addImages = (files) => {
        const valid = Array.from(files).filter((f) =>
            f.type.startsWith("image/"),
        );
        setImages((prev) => [...prev, ...valid]);
    };

    const removeImage = (index, e) => {
        e.stopPropagation(); // Prevent opening file explorer when clicking remove
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        addImages(e.dataTransfer.files);
    };

    const handleWysiwygChange = (val) => {
        setValue("content", val);
        // Trigger validation so errors disappear/appear dynamically
        trigger("content");
    };
const currentUser = useSelector((state) => state.auth?.user || state.app?.user);
    const onSubmit = async (data) => {
        let result;
        const isScheduling = publishMode === "schedule";
        if (isScheduling && !validateSchedule()) return;

        if (postType === "poll") {
            const validOptions = pollOptions.filter((o) => o.trim());
            result = await dispatch(
                publish_engagement_post_thunk({
                    type: "poll",
                    headline: data.title,
                    message: data.content ?? "",
                    publish_to: "All Employees",
                    options: validOptions,
                    scheduled_at: isScheduling ? scheduledAt : null,
                }),
            );
            if (publish_engagement_post_thunk.fulfilled.match(result)) {
                await dispatch(get_engagement_posts_thunk());
                dispatch(
                    setAlert({
                        type: "success",
                        title: isScheduling
                            ? "Poll Scheduled Successfully!"
                            : "Poll Published Successfully!",
                        open: true,
                    }),
                );
                resetForm();
            } else {
                dispatch(
                    setAlert({
                        type: "error",
                        title: "Failed to publish poll",
                        message:
                            result.payload?.message ?? "Something went wrong.",
                        open: true,
                    }),
                );
            }
        } else {
            result = await dispatch(
                create_engagement_post_thunk({
                    ...data,
                    category: selectedCategory,
                    images,
                    publish_mode: publishMode,
                    scheduled_at: isScheduling ? scheduledAt : null,
                }),
            );
            if (create_engagement_post_thunk.fulfilled.match(result)) {
                await dispatch(get_engagement_posts_thunk());
                dispatch(
                    setAlert({
                        type: "success",
                        title: isScheduling
                            ? "Post Scheduled Successfully!"
                            : "Post Published Successfully!",
                        open: true,
                    }),
                );
                resetForm();
            } else {
                dispatch(
                    setAlert({
                        type: "error",
                        title: "Failed to publish post",
                        message:
                            result.payload?.message ?? "Something went wrong.",
                        open: true,
                    }),
                );
            }
        }
    };

    return (
        <div className="flex w-full flex-col gap-3 font-sans">
            {/* Compact trigger */}
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                    {currentUser?.avatar ? (
                        <img
                            src={currentUser.avatar}
                            alt={currentUser.name || "User Avatar"}
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                        />
                    ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white">
                            {currentUser?.name ? (
                                currentUser.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2)
                            ) : (
                                <User className="h-5 w-5" />
                            )}
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => setIsOpen(true)}
                        className="w-full rounded-full border border-transparent bg-slate-100 px-4 py-3 text-left text-sm text-slate-500 transition-all hover:border-slate-200 hover:bg-slate-50"
                    >
                        Share an update with the floor...
                    </button>
                </div>
            </div>

            {/* Composer modal */}
            <Modal
                isOpen={isOpen}
                onClose={resetForm}
                title={
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
                            <FaPaperPlane size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                                Engagement / Home
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
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6 p-6"
                >
                    {/* Type switcher — Post vs Poll */}
                    <div className="flex gap-2 rounded-2xl bg-slate-100 p-1">
                        {POST_TYPES.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setPostType(id)}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition-all ${
                                    postType === id
                                        ? "bg-white text-slate-800 shadow-sm"
                                        : "text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* ── POST fields ─────────────────────────────────── */}
                    {postType === "post" && (
                        <>
                            {/* Category pills */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Category
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.map(({ id, icon: Icon }) => (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedCategory(id)
                                            }
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                                                selectedCategory === id
                                                    ? "border-slate-500 bg-white text-slate-800 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.25)]"
                                                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                                            }`}
                                        >
                                            <Icon className="h-3.5 w-3.5" />
                                            <span>{id}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Title */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Title{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter a title..."
                                    className={`w-full rounded-3xl border px-5 py-3.5 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 ${errors.title ? "border-red-400" : "border-slate-200"}`}
                                    {...register("title", {
                                        required: "Title is required",
                                    })}
                                />
                                {errors.title && (
                                    <p className="text-xs text-red-500">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Content{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Wysiwyg
                                    value={content ?? ""}
                                    onChange={handleWysiwygChange}
                                />
                                {errors.content && (
                                    <p className="text-xs text-red-500">
                                        {errors.content.message}
                                    </p>
                                )}
                            </div>

                            {/* Image Upload */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Images{" "}
                                    <span className="text-xs font-normal text-slate-400">
                                        (optional)
                                    </span>
                                </label>
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-5 transition-colors ${isDragging ? "border-indigo-400 bg-indigo-50" : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"}`}
                                >
                                    <ImagePlus className="h-6 w-6 text-slate-400" />
                                    <p className="text-xs text-slate-500">
                                        <span className="font-semibold text-indigo-600">
                                            Click to upload
                                        </span>{" "}
                                        or drag &amp; drop
                                    </p>
                                    <p className="text-[11px] text-slate-400">
                                        JPG, PNG, GIF, WEBP — max 5 MB each
                                    </p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpg,image/jpeg,image/png,image/gif,image/webp"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => addImages(e.target.files)}
                                />
                                {images.length > 0 && (
                                    <div className="mt-1 grid grid-cols-4 gap-2 sm:grid-cols-6">
                                        {images.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                                            >
                                                <img
                                                    src={previewUrls[idx]}
                                                    alt={img.name}
                                                    className="h-full w-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) =>
                                                        removeImage(idx, e)
                                                    }
                                                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* ── POLL fields ─────────────────────────────────── */}
                    {postType === "poll" && (
                        <>
                            {/* Poll question/headline */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Poll Question{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="What would you like to ask?"
                                    className={`w-full rounded-3xl border px-5 py-3.5 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 ${errors.title ? "border-red-400" : "border-slate-200"}`}
                                    {...register("title", {
                                        required: "Poll question is required",
                                    })}
                                />
                                {errors.title && (
                                    <p className="text-xs text-red-500">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            {/* Optional description */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">
                                    Description{" "}
                                    <span className="text-xs font-normal text-slate-400">
                                        (optional)
                                    </span>
                                </label>
                                <Wysiwyg
                                    value={content ?? ""}
                                    onChange={handleWysiwygChange}
                                />
                            </div>

                            {/* Poll options */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-semibold text-slate-700">
                                    Options{" "}
                                    <span className="text-red-500">*</span>
                                    <span className="ml-1 text-xs font-normal text-slate-400">
                                        (min 2)
                                    </span>
                                </label>
                                {pollOptions.map((opt, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="w-5 shrink-0 text-center text-xs font-bold text-slate-400">
                                            {idx + 1}
                                        </span>
                                        <input
                                            type="text"
                                            value={opt}
                                            placeholder={`Option ${idx + 1}`}
                                            onChange={(e) => {
                                                const updated = [
                                                    ...pollOptions,
                                                ];
                                                updated[idx] = e.target.value;
                                                setPollOptions(updated);
                                            }}
                                            className="flex-1 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                                        />
                                        {pollOptions.length > 2 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setPollOptions((prev) =>
                                                        prev.filter(
                                                            (_, i) => i !== idx,
                                                        ),
                                                    )
                                                }
                                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {pollOptions.length < 6 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPollOptions((prev) => [
                                                ...prev,
                                                "",
                                            ])
                                        }
                                        className="flex items-center gap-2 self-start rounded-full border border-dashed border-slate-300 px-4 py-2 text-xs font-medium text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Add option
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {/* Schedule Publish panel */}
                    {showScheduler && (
                        <div className="flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
                            <p className="text-sm font-semibold text-slate-700">
                                Schedule Post
                            </p>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Date &amp; Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={scheduledAt}
                                    min={new Date(
                                        Date.now() - new Date().getTimezoneOffset() * 60000,
                                    )
                                        .toISOString()
                                        .slice(0, 16)}
                                    onChange={(e) => {
                                        setScheduledAt(e.target.value);
                                        setScheduleError("");
                                    }}
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                                />
                                {scheduleError && (
                                    <p className="text-xs text-red-500">
                                        {scheduleError}
                                    </p>
                                )}
                                {scheduledAt && !scheduleError && (
                                    <p className="text-xs text-slate-500">
                                        Scheduled for{" "}
                                        <span className="font-semibold text-slate-700">
                                            {new Date(
                                                scheduledAt,
                                            ).toLocaleString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </p>
                                )}
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="light"
                                    outlined
                                    onClick={cancelSchedule}
                                    className="rounded-full border-slate-300 px-4 text-slate-600"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={confirmSchedule}
                                    className="rounded-full bg-indigo-700 px-4 text-white hover:bg-indigo-800"
                                >
                                    Confirm Schedule
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-2">
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                                {postType === "poll" ? (
                                    <>
                                        <BarChart2 className="h-3.5 w-3.5" />
                                        <span>Poll</span>
                                    </>
                                ) : (
                                    <>
                                        <Tag className="h-3.5 w-3.5" />
                                        <span>{selectedCategory}</span>
                                    </>
                                )}
                            </div>
                            {publishMode === "schedule" && scheduledAt && (
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>
                                        {new Date(scheduledAt).toLocaleString(
                                            "en-US",
                                            {
                                                month: "short",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                            },
                                        )}
                                    </span>
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
                            <div className="relative flex" ref={publishMenuRef}>
                                <div className="flex overflow-hidden rounded-full shadow-sm ring-1 ring-indigo-800/10">
                                    <Button
                                        type="submit"
                                        disabled={!canPublish || showScheduler}
                                        loading={isSubmitting || creating || publishing}
                                        className="gap-2 rounded-none bg-indigo-700 px-6 text-white hover:bg-indigo-800"
                                    >
                                        {!(isSubmitting || creating || publishing) && (
                                            publishMode === "schedule" ? (
                                                <Clock className="h-4 w-4" />
                                            ) : (
                                                <Send className="h-4 w-4" />
                                            )
                                        )}
                                        <span>
                                            {publishMode === "schedule"
                                                ? "Schedule Publish"
                                                : postType === "poll"
                                                  ? "Publish Poll"
                                                  : "Publish Post"}
                                        </span>
                                    </Button>
                                    <button
                                        type="button"
                                        disabled={isSubmitting || creating || publishing}
                                        onClick={() =>
                                            setShowPublishMenu((v) => !v)
                                        }
                                        aria-label="More publish options"
                                        className="flex items-center justify-center border-l border-white/20 bg-indigo-700 px-2.5 text-white transition hover:bg-indigo-800 disabled:opacity-50"
                                    >
                                        <ChevronDown
                                            className={`h-4 w-4 transition-transform duration-150 ${showPublishMenu ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                </div>
                                {showPublishMenu && (
                                    <div className="absolute bottom-full right-0 z-50 mb-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 text-sm shadow-lg">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPublishMode("now");
                                                setShowPublishMenu(false);
                                            }}
                                            className="flex w-full items-start gap-2.5 px-3.5 py-2.5 text-left hover:bg-slate-50"
                                        >
                                            <Send className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                                            <span className="flex-1">
                                                <span className="block font-medium text-slate-700">
                                                    Publish Now
                                                </span>
                                                <span className="block text-xs text-slate-400">
                                                    Goes live immediately
                                                </span>
                                            </span>
                                            {publishMode === "now" && (
                                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowScheduler(true);
                                                setShowPublishMenu(false);
                                            }}
                                            className="flex w-full items-start gap-2.5 px-3.5 py-2.5 text-left hover:bg-slate-50"
                                        >
                                            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                                            <span className="flex-1">
                                                <span className="block font-medium text-slate-700">
                                                    Schedule Publish
                                                </span>
                                                <span className="block text-xs text-slate-400">
                                                    Pick a future date &amp; time
                                                </span>
                                            </span>
                                            {publishMode === "schedule" && (
                                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
