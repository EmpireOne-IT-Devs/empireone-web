import React from "react";
import Card from "@/app/_components/card";
import { useSelector } from "react-redux";
import { Calendar, Folder, Image } from "lucide-react";

export default function CardUploadedImageSection() {
    // 1. Pull dynamic posts from the Redux store
    const { posts } = useSelector((state) => state.engagement);

    // 2. Filter for events that have an active image gallery uploaded
    const galleryEvents = posts.filter(
        (post) => post.category === "Event" && post.files && post.files.length > 0
    );

    // Fallback UI if there are no galleries uploaded yet
    if (galleryEvents.length === 0) {
        return (
            <Card pclassName="max-w-6xl mx-auto my-5 p-8 flex flex-col items-center justify-center text-center border-dashed border-2 border-gray-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-400 mb-3">
                    <Image size={24} />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">No Photo Galleries</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                    Once photo galleries are uploaded for linked events, they will appear right here.
                </p>
            </Card>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {galleryEvents.map((post) => {
                // Determine display details dynamically from the post
                const displayTitle = post.title || post.headline || "Untitled Event";
                const photoCount = post.files?.length || 0;
                
                // Format the created_at timestamp or fall back to an empty string
                const displayDate = post.created_at 
                    ? new Date(post.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                      })
                    : "";

                return (
                    <Card 
                        key={post.id} 
                        pclassName="max-w-6xl mx-auto w-full overflow-hidden cursor-default hover:shadow-sm"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-5 pr-6">
                            <div>
                                <h2 className="mb-1.5 text-md font-semibold text-gray-800">
                                    {displayTitle}
                                </h2>
                                <div className="flex items-center gap-1.5 text-sm text-gray-400">
                                    <Calendar className="w-4 h-4" />
                                    {displayDate && (
                                        <>
                                            <span>{displayDate}</span>
                                            <span className="text-gray-200">•</span>
                                        </>
                                    )}
                                    <span>{photoCount} {photoCount === 1 ? "photo" : "photos"}</span>
                                </div>
                            </div>

                            {/* Actions - Show Open in Drive if a drive link exists */}
                            {post.drive_link && (
                                <div className="flex gap-3">
                                    <a 
                                        href={post.drive_link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <Folder className="w-4 h-4" /> Open in Drive
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Image Horizontal Slider */}
                        <div className="overflow-x-auto w-full scrollbar-thin">
                            <div className="flex gap-3.5 pr-6 pb-2">
                                {post.files.map((fileObj, index) => {
                                    // Handles if files are direct string URLs, or objects like { url: "..." }
                                    const src = typeof fileObj === "string" ? fileObj : fileObj.url;

                                    return (
                                        <div
                                            key={index}
                                            className="flex-none w-[150px] h-[180px] rounded-lg overflow-hidden bg-gray-50 border border-gray-100"
                                        >
                                            <img
                                                src={src}
                                                alt={`${displayTitle} photo ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform hover:scale-105 duration-200"
                                                loading="lazy"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}