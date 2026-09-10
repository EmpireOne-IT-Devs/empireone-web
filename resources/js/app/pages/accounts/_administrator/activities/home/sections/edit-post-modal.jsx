import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CalendarDays, Newspaper, Send, Megaphone, ImagePlus, Trash2, X } from "lucide-react";
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
    const fileInputRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState(post?.category ?? "Event");
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [newPreviewUrls, setNewPreviewUrls] = useState([]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: post?.title ?? "",
            content: post?.content ?? "",
        },
    });

    const content = watch("content");

    useEffect(() => {
        if (!post) return;

        setSelectedCategory(post?.category ?? "Event");
        setExistingImages((post?.files ?? []).map((file) => ({
            id: file.id,
            name: file.name,
            url: file.url,
        })));
        setNewImages([]);
        reset({
            title: post?.title ?? "",
            content: post?.content ?? "",
        });
    }, [post, reset]);

    useEffect(() => {
        const urls = newImages.map((image) => URL.createObjectURL(image));
        setNewPreviewUrls(urls);

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [newImages]);

    const addImages = (files) => {
        const validImages = Array.from(files ?? []).filter((file) =>
            file.type.startsWith("image/"),
        );

        if (validImages.length === 0) return;

        setNewImages((prev) => [...prev, ...validImages]);
    };

    const removeExistingImage = (fileId) => {
        setExistingImages((prev) => prev.filter((file) => file.id !== fileId));
    };

    const removeNewImage = (indexToRemove) => {
        setNewImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    const onSubmit = async (data) => {
        const result = await dispatch(
            update_engagement_post_thunk({
                id: post.id,
                data: {
                    ...data,
                    category: selectedCategory,
                    retain_file_ids: existingImages.map((file) => file.id),
                    images: newImages,
                },
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

                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                        <label className="text-sm font-semibold text-slate-700">
                            Images <span className="text-xs font-normal text-slate-400">(optional)</span>
                        </label>
                        <button
                            type="button"
                            onClick={openFilePicker}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
                        >
                            <ImagePlus className="h-4 w-4" />
                            Add images
                        </button>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpg,image/jpeg,image/png,image/gif,image/webp"
                        multiple
                        className="hidden"
                        onChange={(event) => addImages(event.target.files)}
                    />

                    {(existingImages.length > 0 || newImages.length > 0) ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {existingImages.map((image) => (
                                <div key={image.id} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                    <img src={image.url} alt={image.name} className="aspect-square h-full w-full object-cover" />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                        <p className="truncate text-[11px] font-medium text-white">Existing image</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(image.id)}
                                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}

                            {newImages.map((image, index) => (
                                <div key={`${image.name}-${index}`} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                    <img src={newPreviewUrls[index]} alt={image.name} className="aspect-square h-full w-full object-cover" />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-950/75 to-transparent p-2">
                                        <p className="truncate text-[11px] font-medium text-white">New image</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(index)}
                                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={openFilePicker}
                            className="flex min-h-28 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-5 text-center transition hover:border-slate-300 hover:bg-slate-100"
                        >
                            <ImagePlus className="h-6 w-6 text-slate-400" />
                            <p className="text-sm font-medium text-slate-600">Add or replace post images</p>
                            <p className="text-xs text-slate-400">PNG, JPG, GIF, WEBP</p>
                        </button>
                    )}
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