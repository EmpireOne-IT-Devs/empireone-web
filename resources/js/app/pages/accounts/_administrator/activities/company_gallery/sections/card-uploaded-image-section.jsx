import React from "react";
import Card from "@/app/_components/card";
import { Calendar, Folder } from "lucide-react";

const CONFIG = {
    title: "Q3 Townhall Meeting",
    date: "Oct 15, 2025",
    photoCount: 120,
    images: [
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=300&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=300&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=300&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=300&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=300&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=300&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&auto=format&fit=crop&q=60",
    ],
};

export default function CardUploadedImageSection() {
    return (
        <Card pclassName="max-w-6xl mx-auto my-5 overflow-hidden cursor-default hover:shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-5 pr-6">
                <div>
                    <h2 className="mb-1.5 text-md font-semibold text-gray-800">
                        {CONFIG.title}
                    </h2>
                    <div className="flex items-center gap-1.5 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {CONFIG.date}
                        <span className="text-gray-200">•</span>
                        {CONFIG.photoCount} photos
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                        <Folder className="w-4 h-4" /> Open in Drive
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto w-full">
                <div className="flex gap-3.5 pr-6">
                    {CONFIG.images.map((src, index) => (
                        <div
                            key={index}
                            className="flex-none w-[150px] h-[180px] rounded-lg overflow-hidden bg-gray-50"
                        >
                            <img
                                src={src}
                                alt={`${CONFIG.title} photo ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
