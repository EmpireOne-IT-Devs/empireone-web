import React, { useEffect, useState } from "react";
import {
    Award,
    Heart,
    MessageCircle,
    Share2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import Badge from "@/app/_components/badge";
import Card from "@/app/_components/card";
import { useDispatch, useSelector } from "react-redux";
import { get_activity_posts_thunk } from "@/app/redux/activities-slice";

const FALLBACK_IMAGE = "/images/building.jpg";
const AUTHOR_COLORS = [
    "bg-blue-900", "bg-purple-700", "bg-emerald-700",
    "bg-rose-700", "bg-amber-700", "bg-indigo-700",
];
const categoryVariant = {
    Milestone: "info",
    Achievement: "success",
    Strategy: "primary",
};
function stripHtml(html) { return html ? html.replace(/<[^>]+>/g, "").trim() : ""; }
function formatDate(d) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function CompanyFeaturesSection() {
    const dispatch = useDispatch();
    const { posts, postsLoading } = useSelector((s) => s.activities);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => { dispatch(get_activity_posts_thunk()); }, [dispatch]);

    const features = posts
        .filter((p) => p.category === "Milestone")
        .map((p, i) => ({
            id: p.id,
            title: p.headline,
            description: stripHtml(p.message).substring(0, 200),
            category: p.category,
            date: formatDate(p.published_at),
            author: p.author?.name ?? "Admin",
            authorInitial: (p.author?.name ?? "A")[0].toUpperCase(),
            authorBg: AUTHOR_COLORS[i % AUTHOR_COLORS.length],
            likes: 0,
            comments: 0,
            image: p.media_url ?? FALLBACK_IMAGE,
            isFeatured: true,
        }));

    const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1));
    const handleNext = () => setCurrentIndex((prev) => (prev === features.length - 1 ? 0 : prev + 1));

    useEffect(() => {
        if (features.length <= 1) return;
        const interval = setInterval(handleNext, 5000);
        return () => clearInterval(interval);
    }, [features.length]);

    useEffect(() => { setCurrentIndex(0); }, [features.length]);

    if (postsLoading && features.length === 0) {
        return (
            <div className="w-full group">
                <div className="flex items-center gap-2 mb-3">
                    <Award size={18} className="text-indigo-900" />
                    <h2 className="text-sm font-bold text-indigo-950">Featured Highlights</h2>
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
                    <h2 className="text-sm font-bold text-indigo-950">Featured Highlights</h2>
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
                            onClick={handlePrev}
                            className="p-1.5 rounded-lg border hover:bg-gray-50"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <button
                            onClick={handleNext}
                            className="p-1.5 rounded-lg border hover:bg-gray-50"
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
                    className="flex flex-col md:flex-row animate-in fade-in duration-500"
                >
                    {/* Image */}
                    <div className="relative md:w-1/2 h-64 md:h-auto">
                        <img
                            src={currentFeature.image}
                            alt={currentFeature.title}
                            className="w-full h-full object-cover"
                        />

                        {currentFeature.isFeatured && (
                            <div className="absolute top-4 left-4">
                                <Badge label="Featured" variant="warning" />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="md:w-1/2 p-6 flex flex-col justify-between">
                        <div>
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

                            <p className="text-sm text-gray-600">
                                {currentFeature.description}
                            </p>
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

                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <Heart size={14} />
                                    {currentFeature.likes}
                                </div>

                                <div className="flex items-center gap-1">
                                    <MessageCircle size={14} />
                                    {currentFeature.comments}
                                </div>

                                <Share2 size={14} />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Dots */}
            {features.length > 1 && (
                <div className="flex justify-center gap-2 mt-3">
                    {features.map((_, index) => (
                        <button
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
