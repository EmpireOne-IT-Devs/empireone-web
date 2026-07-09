import React, { useState } from "react";
import {
    Send,
    FileText,
    CalendarDays,
    Newspaper,
    Megaphone,
    Tag,
    User,
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
} from "@/app/redux/engagement-slice";
import { FaPaperPlane } from "react-icons/fa";

const CATEGORIES = [
    { id: "Event", icon: CalendarDays },
    { id: "News", icon: Newspaper },
    { id: "Milestone", icon: Send },
    { id: "Announcement", icon: Megaphone },
];

export default function CreatePostCardSection() {
    const dispatch = useDispatch();
    const { creating } = useSelector((state) => state.engagement);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Event");

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: { title: "", content: "" },
    });

    const content = watch("content");
    const title = watch("title");

    const canPublish =
        title?.trim() && (content ?? "").replace(/<[^>]+>/g, "").trim();

    const resetForm = () => {
        reset();
        setSelectedCategory("Event");
        setIsOpen(false);
    };

    const onSubmit = async (data) => {
        const result = await dispatch(
            create_engagement_post_thunk({
                ...data,
                category: selectedCategory,
            }),
        );

        if (create_engagement_post_thunk.fulfilled.match(result)) {
            await dispatch(get_engagement_posts_thunk());
            dispatch(
                setAlert({
                    type: "success",
                    title: "Post Published Successfully!",
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
                        result.payload?.message ??
                        "Something went wrong. Please try again.",
                    open: true,
                }),
            );
        }
    };

    return (
        <div className="flex w-full flex-col gap-3 font-sans">
            {/* Compact trigger */}
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 shadow-sm">
                        <User className="h-5 w-5 text-white" />
                    </div>
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
                                    onClick={() => setSelectedCategory(id)}
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
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter a title..."
                            className={`w-full rounded-3xl border px-5 py-3.5 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 ${
                                errors.title
                                    ? "border-red-400"
                                    : "border-slate-200"
                            }`}
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
                            Content <span className="text-red-500">*</span>
                        </label>
                        <Wysiwyg
                            value={content ?? ""}
                            onChange={(val) => setValue("content", val)}
                        />
                        {errors.content && (
                            <p className="text-xs text-red-500">
                                {errors.content.message}
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                            <Tag className="h-3.5 w-3.5" />
                            <span>{selectedCategory}</span>
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
                                loading={isSubmitting || creating}
                                className="gap-2 rounded-full bg-indigo-700 px-6 text-white hover:bg-indigo-800"
                            >
                                {!(isSubmitting || creating) && (
                                    <Send className="h-4 w-4" />
                                )}
                                <span>Publish Post</span>
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
