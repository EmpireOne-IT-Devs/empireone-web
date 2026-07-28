import React, { useEffect, useRef, useState } from "react";
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
import PostCardModalSection from "@/app/pages/accounts/_administrator/activities/home/sections/post-card-modal-section";
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

const AUTOPLAY_MS = 5000;
const FADE_MS = 300;

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
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Crossfade transition state — purely visual, does not touch data logic
    const [isFading, setIsFading] = useState(false);
    const isFadingRef = useRef(false);
    const fadeTimeoutRef = useRef(null);

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
            const images = Array.isArray(p.files) && p.files.length > 0
                ? p.files
                      .map((file) => file?.url || file?.path)
                      .filter(Boolean)
                : p.media_url
                ? [p.media_url]
                : [FALLBACK_IMAGE];

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
                images,
                image: images[0],
                originalPost: p,
                isFeatured: true,
            };
        });

    // Crossfade-aware index change: fades out, swaps the slide, fades back in.
    // Uses functional setState updaters so the autoplay interval never sees a
    // stale `currentIndex` closure.
    const changeIndex = (indexOrUpdater) => {
        if (isFadingRef.current) return;
        isFadingRef.current = true;
        setIsFading(true);

        fadeTimeoutRef.current = setTimeout(() => {
            setCurrentIndex(indexOrUpdater);
            requestAnimationFrame(() => {
                setIsFading(false);
                isFadingRef.current = false;
            });
        }, FADE_MS);
    };

    const handlePrev = () =>
        changeIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1));
    const handleNext = () =>
        changeIndex((prev) =>
            prev === features.length - 1 ? 0 : prev + 1,
        );
    const goToIndex = (index) => {
        if (index === currentIndex) return;
        changeIndex(index);
    };

    useEffect(() => {
        if (features.length <= 1) return;
        const interval = setInterval(handleNext, AUTOPLAY_MS);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [features.length]);

    useEffect(() => {
        setCurrentIndex(0);
    }, [features.length]);

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [currentIndex]);

    useEffect(() => {
        return () => clearTimeout(fadeTimeoutRef.current);
    }, []);

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
                    <div className="flex flex-col items-center justify-center gap-2 py-16 text-sm text-gray-400">
                        <Award size={22} className="text-gray-300" />
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
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50">
                        <Award size={16} className="text-indigo-700" />
                    </span>
                    <h2 className="text-sm font-bold tracking-tight text-indigo-950">
                        Featured Highlights
                    </h2>
                    {features.length > 1 && (
                        <span className="text-xs font-medium text-gray-400">
                            {currentIndex + 1} / {features.length}
                        </span>
                    )}
                </div>

                {features.length > 1 && (
                    <div className="flex gap-1.5">
                        <button
                            type="button"
                            onClick={handlePrev}
                            aria-label="Previous highlight"
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:border-indigo-200 hover:text-indigo-700 hover:shadow active:scale-95"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <button
                            type="button"
                            onClick={handleNext}
                            aria-label="Next highlight"
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:border-indigo-200 hover:text-indigo-700 hover:shadow active:scale-95"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Card */}
            <Card className="overflow-hidden rounded-3xl border shadow-sm">
                <div className="flex h-[520px] flex-col md:h-[480px] md:flex-row">
                    {/* Image */}
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedFeature(currentFeature)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setSelectedFeature(currentFeature);
                            }
                        }}
                        className="relative h-64 w-full overflow-hidden text-left md:h-full md:w-1/2 cursor-pointer bg-gray-100"
                    >
                        <img
                            src={currentFeature.images[currentImageIndex]}
                            alt={currentFeature.title}
                            className={`h-full w-full object-cover transition-[opacity,transform] duration-300 ease-in-out motion-reduce:transition-none hover:scale-[1.03] ${
                                isFading ? "opacity-0" : "opacity-100"
                            }`}
                        />

                        {/* Subtle gradient so overlaid controls stay legible on any image */}
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/25 to-transparent" />

                        {currentFeature.isFeatured && (
                            <div className="absolute top-4 left-4">
                                <Badge label="Featured" variant="warning" />
                            </div>
                        )}

                        {currentFeature.images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setCurrentImageIndex((prev) =>
                                            prev === 0
                                                ? currentFeature.images.length - 1
                                                : prev - 1,
                                        );
                                    }}
                                    className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-700 shadow-sm backdrop-blur transition-transform hover:bg-white hover:scale-105 active:scale-95"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setCurrentImageIndex((prev) =>
                                            prev === currentFeature.images.length - 1
                                                ? 0
                                                : prev + 1,
                                        );
                                    }}
                                    className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-700 shadow-sm backdrop-blur transition-transform hover:bg-white hover:scale-105 active:scale-95"
                                    aria-label="Next image"
                                >
                                    <ChevronRight size={18} />
                                </button>

                                {/* Image sub-dots */}
                                <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                                    {currentFeature.images.map((_, i) => (
                                        <span
                                            key={i}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                                i === currentImageIndex
                                                    ? "w-4 bg-white"
                                                    : "w-1.5 bg-white/50"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Content — fades in sync with the image */}
                    <div
                        className={`flex min-h-0 flex-1 flex-col justify-between p-6 md:w-1/2 transition-opacity duration-300 ease-in-out motion-reduce:transition-none ${
                            isFading ? "opacity-0" : "opacity-100"
                        }`}
                    >
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
                                <span className="text-gray-300">•</span>
                                <span>{currentFeature.date}</span>
                            </div>

                            <h3 className="text-lg font-bold leading-snug text-gray-900 mb-2">
                                {currentFeature.title}
                            </h3>

                            <WysiwygContent
                                html={currentFeature.description}
                            />
                        </div>

                        <div className="flex items-center justify-between pt-4 mt-6 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm ${currentFeature.authorBg}`}
                                >
                                    {currentFeature.authorInitial}
                                </div>

                                <span className="text-sm font-medium text-gray-800">
                                    {currentFeature.author}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <button
                                    type="button"
                                    onClick={() => setSelectedFeature(currentFeature)}
                                    className={`flex items-center gap-1 transition-colors ${currentFeature.user_has_reacted ? "text-red-500" : "hover:text-gray-700"}`}
                                >
                                    <Heart size={14} className={currentFeature.user_has_reacted ? "fill-red-500" : ""} />
                                    <span>{currentFeature.likes > 0 ? currentFeature.likes : ""}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setSelectedFeature(currentFeature)}
                                    className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                                >
                                    <MessageCircle size={14} />
                                    <span>{currentFeature.comments > 0 ? currentFeature.comments : ""}</span>
                                </button>

                                <Share2 size={14} className="hover:text-gray-700 cursor-pointer transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <PostCardModalSection
                post={selectedFeature?.originalPost ?? selectedFeature}
                onClose={() => setSelectedFeature(null)}
            />

            {/* Dots with an autoplay progress fill on the active one */}
            {features.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    {features.map((_, index) => (
                        <button
                            type="button"
                            key={index}
                            onClick={() => goToIndex(index)}
                            aria-label={`Go to highlight ${index + 1}`}
                            className={`relative h-1.5 overflow-hidden rounded-full bg-gray-200 transition-all duration-300 ${
                                currentIndex === index ? "w-8" : "w-1.5 hover:bg-gray-300"
                            }`}
                        >
                            {currentIndex === index && (
                                <span
                                    key={`progress-${currentIndex}-${isFading}`}
                                    className="absolute inset-y-0 left-0 rounded-full bg-indigo-600 motion-reduce:hidden"
                                    style={{
                                        animation: isFading
                                            ? "none"
                                            : `feature-autoplay ${AUTOPLAY_MS}ms linear forwards`,
                                    }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}

            <style>{`
                @keyframes feature-autoplay {
                    from { width: 0%; }
                    to { width: 100%; }
                }
            `}</style>
        </div>
    );
}