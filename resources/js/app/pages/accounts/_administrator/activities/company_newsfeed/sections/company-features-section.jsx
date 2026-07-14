import React, { useEffect, useState } from "react";
import {
    Award,
    Heart,
    MessageCircle,
    Share2,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";
import Badge from "@/app/_components/badge";
import Card from "@/app/_components/card";
import { useDispatch, useSelector } from "react-redux";
// 1. Updated Redux Thunk import to use engagement
import { get_engagement_posts_thunk } from "@/app/redux/engagement-thunk";

const FALLBACK_IMAGE = "/images/building.jpg";
const AUTHOR_COLORS = [
    "bg-blue-900",
    "bg-purple-700",
    "bg-emerald-700",
    "bg-rose-700",
    "bg-amber-700",
    "bg-indigo-700",
];
const categoryVariant = {
    Milestone: "info",
    Achievement: "success",
    Strategy: "primary",
};

function formatDate(d) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function WysiwygContent({ html }) {
    return (
        <div
            className="max-h-64 overflow-y-auto overflow-x-hidden pr-2 text-sm leading-7 text-gray-600 break-words md:text-base [&_*]:max-w-full [&_a]:break-all [&_a]:text-blue-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_b]:font-bold [&_em]:italic [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_i]:italic [&_img]:my-3 [&_img]:rounded-xl [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_strong]:font-bold [&_strong]:text-gray-800 [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-gray-200 [&_td]:p-2 [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:p-2 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: html ?? "" }}
        />
    );
}

export default function CompanyFeaturesSection() {
    const dispatch = useDispatch();
    
    // 2. Switched target from state.activities to state.engagement
    const { posts, postsLoading } = useSelector((s) => s.engagement);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [previewImage, setPreviewImage] = useState(null);

    // 3. Updated dispatch to fetch the correct engagement posts thunk
    useEffect(() => {
        dispatch(get_engagement_posts_thunk());
    }, [dispatch]);

    const postArray = Array.isArray(posts) ? posts : [];

    const features = postArray
        .filter((p) => p.category === "Milestone")
        .map((p, i) => {
            // 4. Fallback schemas for headline/title and message/content
            const rawMessage = p.message || p.content || "";
            const rawTitle = p.headline || p.title || "Untitled Milestone";

            return {
                id: p.id,
                title: rawTitle,
                description: rawMessage,
                category: p.category,
                date: formatDate(p.published_at || p.created_at),
                author: p.author?.name ?? "Admin",
                authorInitial: (p.author?.name ?? "A")[0].toUpperCase(),
                authorBg: AUTHOR_COLORS[i % AUTHOR_COLORS.length],
                // 5. Connect real reaction and comment metrics from the engagement slice
                likes: p.reaction_count ?? 0,
                comments: p.comment_count ?? 0,
                user_has_reacted: p.user_has_reacted ?? false,
                image: p.files?.[0]?.url || p.media_url || FALLBACK_IMAGE,
                isFeatured: true,
            };
        });

    const handlePrev = () =>
        setCurrentIndex((prev) =>
            prev === 0 ? features.length - 1 : prev - 1,
        );
    const handleNext = () =>
        setCurrentIndex((prev) =>
            prev === features.length - 1 ? 0 : prev + 1,
        );

    useEffect(() => {
        if (features.length <= 1) return;
        const interval = setInterval(handleNext, 5000);
        return () => clearInterval(interval);
    }, [features.length]);

    useEffect(() => {
        setCurrentIndex(0);
    }, [features.length]);

    if (postsLoading && features.length === 0) {
        return (
            <div className="w-full group">
                <div className="flex items-center gap-2 mb-3">
                    <Award size={18} className="text-indigo-900" />
                    <h2 className="text-sm font-bold text-indigo-950">
                        Featured Highlights
                    </h2>
                </div>
                <div className="w-full h-64 rounded-2xl bg-gray-100 animate-pulse" />
            </div>
        );
    }

    if (features.length === 0) {
        return (
            <div className="w-full group">
                <div className="flex items-center gap-2 mb-3">
                    <Award size={18} className="text-indigo-900" />
                    <h2 className="text-sm font-bold text-indigo-950">
                        Featured Highlights
                    </h2>
                </div>
                <Card className="overflow-hidden rounded-2xl border">
                    <div className="flex items-center justify-center py-16 text-sm text-gray-400">
                        No milestone highlights published yet.
                    </div>
                </Card>
            </div>
        );
    }

    const currentFeature = features[currentIndex] ?? features[0];

    return (
        <div className="w-full group">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Award size={18} className="text-indigo-900" />
                    <h2 className="text-sm font-bold text-indigo-950">
                        Featured Highlights
                    </h2>
                </div>

                {features.length > 1 && (
                    <div className="flex gap-1">
                        <button
                            type="button"
                            onClick={handlePrev}
                            className="p-1.5 rounded-lg border hover:bg-gray-50 transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <button
                            type="button"
                            onClick={handleNext}
                            className="p-1.5 rounded-lg border hover:bg-gray-50 transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Card */}
            <Card className="overflow-hidden rounded-2xl border">
                <div
                    key={currentFeature.id}
                    className="flex h-[520px] flex-col animate-in fade-in duration-500 md:h-[480px] md:flex-row"
                >
                    {/* Image */}
                    <button
                        type="button"
                        onClick={() => setPreviewImage(currentFeature)}
                        className="relative h-64 w-full overflow-hidden text-left md:h-full md:w-1/2"
                    >
                        <img
                            src={currentFeature.image}
                            alt={currentFeature.title}
                            className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
                        />

                        {currentFeature.isFeatured && (
                            <div className="absolute top-4 left-4">
                                <Badge label="Featured" variant="warning" />
                            </div>
                        )}
                    </button>

                    {/* Content */}
                    <div className="flex min-h-0 flex-1 flex-col justify-between p-6 md:w-1/2">
                        <div className="min-h-0">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                <Badge
                                    label={currentFeature.category}
                                    variant={
                                        categoryVariant[
                                            currentFeature.category
                                        ] || "secondary"
                                    }
                                />
                                <span>•</span>
                                <span>{currentFeature.date}</span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {currentFeature.title}
                            </h3>

                            <WysiwygContent
                                html={currentFeature.description}
                            />
                        </div>

                        <div className="flex items-center justify-between pt-4 mt-6 border-t">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${currentFeature.authorBg}`}
                                >
                                    {currentFeature.authorInitial}
                                </div>

                                <span className="text-sm font-medium">
                                    {currentFeature.author}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className={`flex items-center gap-1 transition-colors ${currentFeature.user_has_reacted ? "text-red-500" : ""}`}>
                                    <Heart size={14} className={currentFeature.user_has_reacted ? "fill-red-500" : ""} />
                                    <span>{currentFeature.likes > 0 ? currentFeature.likes : ""}</span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <MessageCircle size={14} />
                                    <span>{currentFeature.comments > 0 ? currentFeature.comments : ""}</span>
                                </div>

                                <Share2 size={14} className="hover:text-gray-700 cursor-pointer transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {previewImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-8 backdrop-blur-sm">
                    <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <button
                            type="button"
                            onClick={() => setPreviewImage(null)}
                            className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-gray-600 shadow-sm transition hover:bg-white hover:text-gray-900"
                            aria-label="Close image preview"
                        >
                            <X size={18} />
                        </button>
                        <img
                            src={previewImage.image}
                            alt={previewImage.title}
                            className="max-h-[82vh] w-full object-contain bg-black"
                        />
                        <div className="border-t border-gray-100 px-5 py-4">
                            <p className="text-sm font-semibold text-gray-900">
                                {previewImage.title}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                {previewImage.category} • {previewImage.date}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Dots */}
            {features.length > 1 && (
                <div className="flex justify-center gap-2 mt-3">
                    {features.map((_, index) => (
                        <button
                            type="button"
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2 rounded-full transition-all ${
                                currentIndex === index
                                    ? "w-6 bg-indigo-600"
                                    : "w-2 bg-gray-300"
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}