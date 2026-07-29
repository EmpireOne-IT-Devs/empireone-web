import React, { useRef, useState, useEffect, useCallback } from "react";
import Card from "@/app/_components/card";
import {
    Calendar,
    Folder,
    Image as ImageIcon,
    ChevronLeft,
    ChevronRight,
    X,
    Maximize2,
    Download,
} from "lucide-react";
import Skeleton from "@/app/_components/skeleton";
import { get_company_galleries } from "@/app/services/engagement-gallery-service";

// Helper to safely extract image URL regardless of backend payload key structure
const getImageUrl = (item) => {
    if (!item) return "";
    if (typeof item === "string") return item;
    return (
        item.url ||
        item.path ||
        item.file_path ||
        item.src ||
        item.original_url ||
        ""
    );
};

function LightboxModal({
    isOpen,
    photos,
    currentIndex,
    onClose,
    onNavigate,
    driveLink,
}) {
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") onNavigate(-1);
            if (e.key === "ArrowRight") onNavigate(1);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose, onNavigate]);

    if (!isOpen) return null;

    const currentPhoto = photos[currentIndex];
    const src = getImageUrl(currentPhoto);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 transition-all duration-300">
            <div className="absolute top-5 right-5 z-10 flex items-center gap-2">
                {driveLink && (
                    <a
                        href={driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2  hover:bg-orange-600 text-white rounded-lg px-3.5 py-2 text-sm font-medium shadow-md transition-all active:scale-95"
                    >
                        <Download className="w-6 h-6" />
                    </a>
                )}
                <button
                    onClick={onClose}
                    className="p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Close fullscreen modal"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {photos.length > 1 && (
                <button
                    onClick={() => onNavigate(-1)}
                    className="absolute left-5 top-1/2 -translate-y-1/2 z-10 p-3 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-all border border-white/10"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            )}

            <div className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center">
                <img
                    src={src}
                    alt={`Photo ${currentIndex + 1}`}
                    className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl select-none"
                />
                <div className="absolute bottom-[-2.5rem] text-xs font-medium text-white/60">
                    {currentIndex + 1} of {photos.length}
                </div>
            </div>

            {photos.length > 1 && (
                <button
                    onClick={() => onNavigate(1)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 z-10 p-3 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-all border border-white/10"
                    aria-label="Next image"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            )}
        </div>
    );
}

function GalleryCarousel({ displayTitle, photos, onOpenLightbox }) {
    const trackRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (isPaused || photos.length <= 1) return;

        const interval = setInterval(() => {
            const track = trackRef.current;
            if (!track) return;

            const cardWidth = 200 + 16;
            const maxScroll = track.scrollWidth - track.clientWidth;

            if (track.scrollLeft >= maxScroll - 5) {
                track.scrollTo({ left: 0, behavior: "smooth" });
                setActiveIndex(0);
            } else {
                track.scrollBy({ left: cardWidth, behavior: "smooth" });
                setActiveIndex((prev) => Math.min(prev + 1, photos.length - 1));
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [isPaused, photos.length]);

    const handleScroll = () => {
        const track = trackRef.current;
        if (!track) return;
        const cardWidth = 200 + 16;
        const index = Math.round(track.scrollLeft / cardWidth);
        setActiveIndex(index);
    };

    const scrollByAmount = useCallback((direction) => {
        const track = trackRef.current;
        if (!track) return;
        const cardWidth = 200 + 16;
        track.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
    }, []);

    return (
        <div
            className="relative group/carousel rounded-xl overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {photos.length > 1 && (
                <>
                    <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black/20 to-transparent pointer-events-none z-10 opacity-0 group-hover/carousel:opacity-100 transition-opacity" />
                    <button
                        type="button"
                        onClick={() => scrollByAmount(-1)}
                        aria-label="Previous photos"
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md border border-gray-100 opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 active:scale-95"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                </>
            )}

            <div
                ref={trackRef}
                onScroll={handleScroll}
                className="overflow-x-auto w-full no-scrollbar snap-x snap-mandatory py-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                <div className="flex gap-4 px-1">
                    {photos.map((fileObj, index) => {
                        const src = getImageUrl(fileObj);

                        return (
                            <div
                                key={index}
                                onClick={() => onOpenLightbox(index)}
                                className="group/item flex-none w-[200px] h-[150px] rounded-xl overflow-hidden bg-gray-100 border border-gray-200/60 shadow-sm snap-start relative cursor-pointer"
                            >
                                <img
                                    src={src}
                                    alt={`${displayTitle} photo ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                                    loading="lazy"
                                />

                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="p-2 rounded-full bg-white/80 text-gray-800 shadow-sm backdrop-blur-sm">
                                        <Maximize2 className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {photos.length > 1 && (
                <>
                    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black/20 to-transparent pointer-events-none z-10 opacity-0 group-hover/carousel:opacity-100 transition-opacity" />
                    <button
                        type="button"
                        onClick={() => scrollByAmount(1)}
                        aria-label="Next photos"
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-md border border-gray-100 opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 active:scale-95"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </>
            )}

            {photos.length > 1 && (
                <div className="flex items-center justify-between px-1 mt-3">
                    <div className="flex items-center gap-1.5">
                        {photos.slice(0, 10).map((_, index) => (
                            <span
                                key={index}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    index === activeIndex
                                        ? "w-5 bg-indigo-600"
                                        : "w-1.5 bg-gray-200"
                                }`}
                            />
                        ))}
                        {photos.length > 10 && (
                            <span className="text-[10px] text-gray-400 font-medium ml-1">
                                +{photos.length - 10}
                            </span>
                        )}
                    </div>
                    <span className="text-xs font-medium text-gray-400">
                        {activeIndex + 1} / {photos.length}
                    </span>
                </div>
            )}
        </div>
    );
}

export default function CardUploadedImageSection({ refreshKey }) {
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lightboxState, setLightboxState] = useState({
        isOpen: false,
        photos: [],
        index: 0,
        driveLink: null,
    });

    const fetchGalleries = async () => {
        setLoading(true);
        try {
            const response = await get_company_galleries();
            setGalleries(response.data || response);
        } catch (error) {
            setGalleries([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGalleries();
    }, [refreshKey]);

    // Safely extract gallery events
    const galleryEvents =
        galleries?.filter((gallery) => {
            const files = gallery.files || [];
            return Array.isArray(files) && files.length > 0;
        }) || [];

    const handleOpenLightbox = (photos, index, driveLink) => {
        setLightboxState({ isOpen: true, photos, index, driveLink });
    };

    const handleCloseLightbox = () => {
        setLightboxState((prev) => ({ ...prev, isOpen: false }));
    };

    const handleNavigateLightbox = (direction) => {
        setLightboxState((prev) => {
            const nextIndex =
                (prev.index + direction + prev.photos.length) %
                prev.photos.length;
            return { ...prev, index: nextIndex };
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-6 w-full my-4">
                <Skeleton variant="card" />
                <Skeleton variant="card" />
            </div>
        );
    }

    if (galleryEvents.length === 0) {
        return (
            <Card pclassName="w-full my-6 p-10 flex flex-col items-center justify-center text-center border-dashed border-2 border-gray-200/80 bg-gray-50/50 rounded-2xl">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 mb-4 shadow-sm">
                    <ImageIcon className="w-7 h-7" />
                </div>
                <h3 className="text-base font-semibold text-gray-800">
                    No Photo Galleries
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm leading-relaxed">
                    Once event galleries are uploaded, you&apos;ll be able to
                    preview and browse event highlights here.
                </p>
            </Card>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full my-4">
            {galleryEvents.map((gallery) => {
                const displayTitle = gallery.title || "Untitled Gallery";
                const photos = gallery.files || [];
                const photoCount = photos.length;
                const driveLink = gallery.drive_link;

                const displayDate = gallery.created_at
                    ? new Date(gallery.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                      })
                    : "";

                return (
                    <Card
                        key={gallery.id}
                        pclassName="w-full p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                                    {displayTitle}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1 max-w-lg">
                                    {gallery.description ||
                                        "No description provided."}
                                </p>
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mt-1">
                                    {displayDate && (
                                        <>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                <span>{displayDate}</span>
                                            </div>
                                            <span className="text-gray-300">
                                                •
                                            </span>
                                        </>
                                    )}
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                        {photoCount}{" "}
                                        {photoCount === 1 ? "photo" : "photos"}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons styled like the screenshot */}
                            {driveLink && (
                                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                                    <a
                                        href={driveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 border border-gray-200 text-white rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-150 active:scale-95 shadow-sm"
                                    >
                                        <Folder className="w-4 h-4 text-white" />
                                        <span>Open in Drive</span>
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Carousel */}
                        <GalleryCarousel
                            displayTitle={displayTitle}
                            photos={photos}
                            onOpenLightbox={(index) =>
                                handleOpenLightbox(photos, index, driveLink)
                            }
                        />
                    </Card>
                );
            })}

            <LightboxModal
                isOpen={lightboxState.isOpen}
                photos={lightboxState.photos}
                currentIndex={lightboxState.index}
                driveLink={lightboxState.driveLink}
                onClose={handleCloseLightbox}
                onNavigate={handleNavigateLightbox}
            />
        </div>
    );
}
