// import React, { useEffect, useState } from "react";
// import {
//     Megaphone,
//     CalendarDays,
//     Newspaper,
//     Send,
//     Tag,
//     FileText,
//     User,
// } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { useForm } from "react-hook-form";
// import Card from "@/app/_components/card";
// import Badge from "@/app/_components/badge";
// import Button from "@/app/_components/button";
// import Modal from "@/app/_components/modal";
// import Wysiwyg from "@/app/_components/wysiwyg";
// import { setAlert } from "@/app/redux/app-slice";
// import {
//     get_engagement_posts_thunk,
//     create_engagement_post_thunk,
// } from "@/app/redux/engagement-slice";
// import { FaPaperPlane } from "react-icons/fa";

// const REFRESH_INTERVAL_MS = 30_000;

// const CATEGORY_CONFIG = {
//     Event:        { icon: CalendarDays, variant: "primary" },
//     News:         { icon: Newspaper,   variant: "info" },
//     Milestone:    { icon: Send,        variant: "success" },
//     Announcement: { icon: Megaphone,   variant: "danger" },
// };

// const CATEGORIES = [
//     { id: "Event",        icon: CalendarDays },
//     { id: "News",         icon: Newspaper },
//     { id: "Milestone",    icon: Send },
//     { id: "Announcement", icon: Megaphone },
// ];

// function PostContent({ content, className = "" }) {
//     return (
//         <div
//             className={`overflow-x-hidden break-words text-sm text-gray-700 leading-relaxed ${className}`}
//             dangerouslySetInnerHTML={{ __html: content ?? "" }}
//         />
//     );
// }

// function EngagementPostCard({ post }) {
//     const categoryKey = post.category ?? "Event";
//     const catConfig = CATEGORY_CONFIG[categoryKey] ?? CATEGORY_CONFIG["Event"];

//     return (
//         <Card variant="default" padding="p-0" className="w-full overflow-hidden font-sans">
//             <div className="px-4 pt-4 pb-3 flex justify-between items-start w-full">
//                 <div className="flex items-center gap-2.5">
//                     {post.author?.avatar ? (
//                         <img
//                             src={post.author.avatar}
//                             alt={post.author.name}
//                             className="w-9 h-9 rounded-full object-cover"
//                         />
//                     ) : (
//                         <div className="w-9 h-9 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-xs">
//                             {post.author?.initials}
//                         </div>
//                     )}
//                     <div>
//                         <h3 className="font-semibold text-gray-900 text-sm leading-tight">
//                             {post.author?.name}
//                         </h3>
//                         <div className="flex items-center gap-1.5 mt-0.5">
//                             <p className="text-xs text-gray-400">
//                                 Engagement • {post.time_ago}
//                             </p>
//                             <span className="text-gray-300">·</span>
//                             <Badge
//                                 label={categoryKey}
//                                 variant={catConfig.variant}
//                                 outlined
//                                 className="text-[10px] py-0"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="px-4 pb-4 flex flex-col gap-1">
//                 <p className="font-semibold text-gray-900 text-sm">{post.title}</p>
//                 <PostContent content={post.content} />
//             </div>
//         </Card>
//     );
// }

// export default function PostCardSection() {
//     const dispatch = useDispatch();
//     const { posts, postsLoading, postsError, creating } = useSelector(
//         (state) => state.engagement,
//     );

//     const [isOpen, setIsOpen] = useState(false);
//     const [selectedCategory, setSelectedCategory] = useState("Event");

//     const {
//         register,
//         handleSubmit,
//         reset,
//         setValue,
//         watch,
//         formState: { errors, isSubmitting },
//     } = useForm({
//         defaultValues: { title: "", content: "" },
//     });

//     const content = watch("content");

//     useEffect(() => {
//         dispatch(get_engagement_posts_thunk());
//         const interval = setInterval(() => {
//             if (!document.hidden) dispatch(get_engagement_posts_thunk());
//         }, REFRESH_INTERVAL_MS);
//         return () => clearInterval(interval);
//     }, [dispatch]);

//     const resetForm = () => {
//         reset();
//         setSelectedCategory("Event");
//         setIsOpen(false);
//     };

//     const onSubmit = async (data) => {
//         const result = await dispatch(
//             create_engagement_post_thunk({
//                 ...data,
//                 category: selectedCategory,
//             }),
//         );

//         if (create_engagement_post_thunk.fulfilled.match(result)) {
//             dispatch(
//                 setAlert({
//                     type: "success",
//                     title: "Post published successfully!",
//                     message: "Your engagement post has been saved.",
//                     open: true,
//                 }),
//             );
//             resetForm();
//         } else {
//             dispatch(
//                 setAlert({
//                     type: "error",
//                     title: "Failed to publish post",
//                     message:
//                         result.payload?.message ??
//                         "Something went wrong. Please try again.",
//                     open: true,
//                 }),
//             );
//         }
//     };

//     const canPublish =
//         watch("title")?.trim() &&
//         (content ?? "").replace(/<[^>]+>/g, "").trim();

//     return (
//         <div className="w-full flex flex-col gap-4 font-sans">
//             {/* ── Create Post Trigger ───────────────────────────────────── */}
//             <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
//                 <div className="flex items-center gap-3">
//                     <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 shadow-sm">
//                         <User className="h-5 w-5 text-white" />
//                     </div>
//                     <button
//                         type="button"
//                         onClick={() => setIsOpen(true)}
//                         className="w-full rounded-full border border-transparent bg-slate-100 px-4 py-3 text-left text-sm text-slate-500 transition-all hover:border-slate-200 hover:bg-slate-50"
//                     >
//                         Share an update with the floor...
//                     </button>
//                 </div>
//             </div>

//             {/* ── Composer Modal ────────────────────────────────────────── */}
//             <Modal
//                 isOpen={isOpen}
//                 onClose={resetForm}
//                 title={
//                     <div className="flex items-center gap-3">
//                         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
//                             <FaPaperPlane size={20} />
//                         </div>
//                         <div>
//                             <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
//                                 Engagement / Home
//                             </p>
//                             <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
//                                 Create New Post
//                             </h2>
//                         </div>
//                     </div>
//                 }
//                 width="max-w-4xl"
//             >
//                 <form
//                     onSubmit={handleSubmit(onSubmit)}
//                     className="flex flex-col gap-6 p-6"
//                 >
//                     {/* Category pills */}
//                     <div className="flex flex-col gap-2">
//                         <label className="text-sm font-semibold text-slate-700">
//                             Category
//                         </label>
//                         <div className="flex flex-wrap gap-2">
//                             {CATEGORIES.map(({ id, icon: Icon }) => (
//                                 <button
//                                     key={id}
//                                     type="button"
//                                     onClick={() => setSelectedCategory(id)}
//                                     className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
//                                         selectedCategory === id
//                                             ? "border-slate-500 bg-white text-slate-800 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.25)]"
//                                             : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
//                                     }`}
//                                 >
//                                     <Icon className="h-3.5 w-3.5" />
//                                     <span>{id}</span>
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Title */}
//                     <div className="flex flex-col gap-2">
//                         <label className="text-sm font-semibold text-slate-700">
//                             Title <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                             type="text"
//                             placeholder="Enter a title..."
//                             className={`w-full rounded-3xl border px-5 py-3.5 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 ${
//                                 errors.title ? "border-red-400" : "border-slate-200"
//                             }`}
//                             {...register("title", { required: "Title is required" })}
//                         />
//                         {errors.title && (
//                             <p className="text-xs text-red-500">{errors.title.message}</p>
//                         )}
//                     </div>

//                     {/* Content */}
//                     <div className="flex flex-col gap-2">
//                         <label className="text-sm font-semibold text-slate-700">
//                             Content <span className="text-red-500">*</span>
//                         </label>
//                         <Wysiwyg
//                             value={content ?? ""}
//                             onChange={(val) => setValue("content", val)}
//                         />
//                         {errors.content && (
//                             <p className="text-xs text-red-500">{errors.content.message}</p>
//                         )}
//                     </div>

//                     {/* Footer */}
//                     <div className="flex items-center justify-between border-t border-slate-100 pt-4">
//                         <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
//                             <Tag className="h-3.5 w-3.5" />
//                             <span>{selectedCategory}</span>
//                         </div>

//                         <div className="flex items-center gap-3">
//                             <Button
//                                 type="button"
//                                 variant="light"
//                                 outlined
//                                 onClick={resetForm}
//                             >
//                                 Cancel
//                             </Button>
//                             <Button
//                                 type="submit"
//                                 disabled={!canPublish}
//                                 loading={isSubmitting || creating}
//                             >
//                                 <Send className="h-4 w-4" />
//                                 Publish Post
//                             </Button>
//                         </div>
//                     </div>
//                 </form>
//             </Modal>

//             {/* ── Posts Feed ───────────────────────────────────────────── */}
//             {postsLoading ? (
//                 <div className="flex flex-col gap-4">
//                     {Array.from({ length: 3 }).map((_, i) => (
//                         <div
//                             key={i}
//                             className="w-full h-40 bg-gray-100 rounded-2xl animate-pulse"
//                         />
//                     ))}
//                 </div>
//             ) : postsError ? (
//                 <div className="flex items-center justify-center py-16 text-sm text-red-400">
//                     Failed to load posts. Please refresh and try again.
//                 </div>
//             ) : posts.length === 0 ? (
//                 <div className="flex items-center justify-center py-16 text-sm text-gray-400">
//                     No posts yet.
//                 </div>
//             ) : (
//                 <div className="w-full flex flex-col gap-4">
//                     {posts.map((post) => (
//                         <EngagementPostCard key={post.id} post={post} />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }


// const REFRESH_INTERVAL_MS = 30_000;

// const CATEGORY_CONFIG = {
//     Event:        { icon: CalendarDays, variant: "primary" },
//     News:         { icon: Newspaper,   variant: "info" },
//     Milestone:    { icon: Send,        variant: "success" },
//     Announcement: { icon: Megaphone,   variant: "danger" },
//     General:      { icon: Tag,         variant: "secondary" },
// };

// const CATEGORY_OPTIONS = [
//     { label: "Event",        value: "Event" },
//     { label: "News",         value: "News" },
//     { label: "Milestone",    value: "Milestone" },
//     { label: "Announcement", value: "Announcement" },
// ];

// function PostContent({ content, className = "" }) {
//     return (
//         <div
//             className={`overflow-x-hidden break-words text-sm text-gray-700 leading-relaxed ${className}`}
//             dangerouslySetInnerHTML={{ __html: content ?? "" }}
//         />
//     );
// }

// function EngagementPostCard({ post }) {
//     const categoryKey = post.category ?? "General";
//     const catConfig = CATEGORY_CONFIG[categoryKey] ?? CATEGORY_CONFIG["General"];
//     const CatIcon = catConfig.icon;

//     return (
//         <Card variant="default" padding="p-0" className="w-full overflow-hidden font-sans">
//             <div className="px-4 pt-4 pb-3 flex justify-between items-start w-full">
//                 <div className="flex items-center gap-2.5">
//                     {post.author?.avatar ? (
//                         <img
//                             src={post.author.avatar}
//                             alt={post.author.name}
//                             className="w-9 h-9 rounded-full object-cover"
//                         />
//                     ) : (
//                         <div className="w-9 h-9 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-xs">
//                             {post.author?.initials}
//                         </div>
//                     )}
//                     <div>
//                         <h3 className="font-semibold text-gray-900 text-sm leading-tight">
//                             {post.author?.name}
//                         </h3>
//                         <div className="flex items-center gap-1.5 mt-0.5">
//                             <p className="text-xs text-gray-400">
//                                 Engagement • {post.time_ago}
//                             </p>
//                             <span className="text-gray-300">·</span>
//                             <Badge
//                                 label={categoryKey}
//                                 variant={catConfig.variant}
//                                 outlined
//                                 className="text-[10px] py-0"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="px-4 pb-4 flex flex-col gap-1">
//                 <p className="font-semibold text-gray-900 text-sm">{post.title}</p>
//                 <PostContent content={post.content} />
//             </div>
//         </Card>
//     );
// }

// export default function PostCardSection() {
//     const dispatch = useDispatch();
//     const { posts, postsLoading, postsError, creating } = useSelector(
//         (state) => state.engagement,
//     );

//     const {
//         register,
//         handleSubmit,
//         reset,
//         watch,
//         setValue,
//         formState: { errors, isSubmitting },
//     } = useForm({
//         defaultValues: { title: "", content: "", category: "" },
//     });

//     const form = watch();

//     useEffect(() => {
//         dispatch(get_engagement_posts_thunk());
//         const interval = setInterval(() => {
//             if (!document.hidden) dispatch(get_engagement_posts_thunk());
//         }, REFRESH_INTERVAL_MS);
//         return () => clearInterval(interval);
//     }, [dispatch]);

//     const onSubmit = async (data) => {
//         const result = await dispatch(create_engagement_post_thunk(data));

//         if (create_engagement_post_thunk.fulfilled.match(result)) {
//             dispatch(
//                 setAlert({
//                     type: "success",
//                     title: "Post created successfully!",
//                     message: "Your engagement post has been saved.",
//                     open: true,
//                 }),
//             );
//             reset();
//         } else {
//             dispatch(
//                 setAlert({
//                     type: "error",
//                     title: "Failed to create post",
//                     message:
//                         result.payload?.message ??
//                         "Something went wrong. Please try again.",
//                     open: true,
//                 }),
//             );
//         }
//     };

//     return (
//         <div className="w-full flex flex-col gap-6">
//             {/* ── Create Post Form ─────────────────────────────────────── */}
//             <Card variant="default" padding="p-5" className="w-full font-sans">
//                 <p className="text-sm font-semibold text-gray-700 mb-4">
//                     Create a Post
//                 </p>
//                 <form onSubmit={handleSubmit(onSubmit)} className="w-full">
//                     <div className="grid grid-cols-1 gap-y-4">
//                         <Input
//                             label="Title"
//                             name="title"
//                             placeholder="Post title"
//                             {...register("title", { required: "Title is required" })}
//                             error={errors.title}
//                             iconLeft={<FileText size={14} />}
//                         />

//                         <div className="flex flex-col gap-1">
//                             <label className="text-xs font-medium text-gray-600">
//                                 Content <span className="text-red-500">*</span>
//                             </label>
//                             <textarea
//                                 rows={4}
//                                 placeholder="Write your post content here…"
//                                 className={`w-full rounded-xl border px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-indigo-300 resize-none ${
//                                     errors.content
//                                         ? "border-red-400 focus:ring-red-200"
//                                         : "border-gray-200 focus:border-indigo-400"
//                                 }`}
//                                 {...register("content", {
//                                     required: "Content is required",
//                                 })}
//                             />
//                             {errors.content && (
//                                 <p className="text-xs text-red-500 mt-0.5">
//                                     {errors.content.message}
//                                 </p>
//                             )}
//                         </div>

//                         <Select
//                             label="Category"
//                             name="category"
//                             value={form.category}
//                             options={CATEGORY_OPTIONS}
//                             onChange={(val) => setValue("category", val)}
//                             error={errors.category}
//                         />

//                         <Button
//                             type="submit"
//                             variant="secondary"
//                             loading={isSubmitting || creating}
//                         >
//                             PUBLISH POST
//                         </Button>
//                     </div>
//                 </form>
//             </Card>

//             {/* ── Posts Feed ───────────────────────────────────────────── */}
//             {postsLoading ? (
//                 <div className="flex flex-col gap-4">
//                     {Array.from({ length: 3 }).map((_, i) => (
//                         <div
//                             key={i}
//                             className="w-full h-40 bg-gray-100 rounded-2xl animate-pulse"
//                         />
//                     ))}
//                 </div>
//             ) : postsError ? (
//                 <div className="flex items-center justify-center py-16 text-sm text-red-400">
//                     Failed to load posts. Please refresh and try again.
//                 </div>
//             ) : posts.length === 0 ? (
//                 <div className="flex items-center justify-center py-16 text-sm text-gray-400">
//                     No posts yet.
//                 </div>
//             ) : (
//                 <div className="w-full flex flex-col gap-4">
//                     {posts.map((post) => (
//                         <EngagementPostCard key={post.id} post={post} />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

