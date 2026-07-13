// edit-post-modal.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CalendarDays, Newspaper, Send, Megaphone } from "lucide-react";
import { FaPaperPlane } from "react-icons/fa";
import { useForm } from "react-hook-form";
import Modal from "@/app/_components/modal";
import Wysiwyg from "@/app/_components/wysiwyg";
import Button from "@/app/_components/button";
import { setAlert } from "@/app/redux/app-slice";
import { update_engagement_post_thunk } from "@/app/redux/engagement-slice";

const CATEGORIES = [
    { id: "Event", icon: CalendarDays },
    { id: "News", icon: Newspaper },
    { id: "Milestone", icon: Send },
    { id: "Announcement", icon: Megaphone },
];

export default function EditPostModal({ post, onClose }) {
    const dispatch = useDispatch();
    const { updating } = useSelector((state) => state.engagement);
    const [selectedCategory, setSelectedCategory] = useState(post?.category ?? "Event");

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: post?.title ?? "",
            content: post?.content ?? "",
        },
    });

    const content = watch("content");

    const onSubmit = async (data) => {
        const result = await dispatch(
            update_engagement_post_thunk({
                id: post.id,
                data: { ...data, category: selectedCategory },
            }),
        );
        if (update_engagement_post_thunk.fulfilled.match(result)) {
            dispatch(
                setAlert({
                    type: "success",
                    title: "Post updated successfully!",
                    open: true,
                }),
            );
            onClose();
        } else {
            dispatch(
                setAlert({
                    type: "error",
                    title: "Failed to update post",
                    open: true,
                }),
            );
        }
    };

    return (
        <Modal
            isOpen={!!post}
            onClose={onClose}
            title={
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
                        <FaPaperPlane size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                            Engagement / Edit
                        </p>
                        <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                            Edit Post
                        </h2>
                    </div>
                </div>
            }
            width="max-w-3xl"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Category</label>
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

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter a title..."
                        className={`w-full rounded-3xl border px-5 py-3.5 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 ${
                            errors.title ? "border-red-400" : "border-slate-200"
                        }`}
                        {...register("title", { required: "Title is required" })}
                    />
                    {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">
                        Content <span className="text-red-500">*</span>
                    </label>
                    <Wysiwyg value={content ?? ""} onChange={(val) => setValue("content", val)} />
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                    <Button type="button" variant="light" outlined onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={updating}>
                        Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    );
}