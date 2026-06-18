import React, { useState } from "react";
import { Newspaper, Heart, MessageSquare, Share2 } from "lucide-react";
import Card from "@/app/_components/card";
import Badge from "@/app/_components/badge";
import ViewNewsSection from "./view-news-section";

const categoryVariantMap = {
    Business: "primary",
    Product: "success",
    HR: "purple",
    Finance: "warning",
    Sales: "info",
};

export default function NewsSection() {
    const [selectedItem, setSelectedItem] = useState(null);

    const newsItems = [
        {
            id: 1,
            category: "Business",
            image: "/images/test.jpg",
            date: "Dec 20, 2024",
            title: "Q4 Financial Results Exceed Expectations",
            description:
                "Our company achieved a remarkable 35% revenue growth this quarter, surpassing all projections...",
            likes: 234,
            comments: 45,
        },
        {
            id: 2,
            category: "Product",
            image: "/images/test.jpg",
            date: "Dec 19, 2024",
            title: "New Product Launch: Innovation at Its Best",
            description:
                "Introducing our latest product line that combines cutting-edge technology with user-centric design...",
            likes: 189,
            comments: 32,
        },
        {
            id: 3,
            category: "HR",
            image: "/images/test.jpg",
            date: "Dec 18, 2024",
            title: "New Diversity & Inclusion Initiatives Announced",
            description:
                "We are proud to launch a series of initiatives aimed at fostering a more inclusive and equitable workplace for all employees...",
            likes: 312,
            comments: 58,
        },
        {
            id: 4,
            category: "Sales",
            image: "/images/test.jpg",
            date: "Dec 17, 2024",
            title: "Sales Team Closes Record-Breaking Deal",
            description:
                "Our sales team has secured the largest contract in company history, opening doors to new markets across Southeast Asia...",
            likes: 421,
            comments: 74,
        },
    ];

    return (
        <div className="w-full bg-[#f4f6f9] p-6 rounded-2xl min-h-full">
            {/* Main Section Header */}
            <div className="flex items-center gap-2 mb-5">
                <Newspaper className="text-[#0f172a]" size={22} />
                <h2 className="text-lg font-bold text-[#0f172a] tracking-tight">
                    Latest News
                </h2>
            </div>

            {/* Two-Column Responsive Layout Grid */}
            <div className="grid grid-cols-2 gap-5">
                {newsItems.map((item) => (
                    <Card
                        key={item.id}
                        variant="default"
                        padding="p-0"
                        className="col-span-1 overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-md "
                        onClick={() => setSelectedItem(item)}
                    >
                        {/* Image Container with Badge */}
                        <div className="relative w-full h-44 bg-gray-100 overflow-hidden ">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 left-3 mt-3">
                                <Badge
                                    label={item.category}
                                    variant={categoryVariantMap[item.category] ?? "primary"}
                                    className="shadow-sm backdrop-blur-sm"
                                />
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <span className="text-xs text-gray-400 font-medium block mb-1">
                                    {item.date}
                                </span>
                                <h3 className="text-sm font-bold text-gray-900 leading-snug tracking-tight mb-1.5 hover:text-blue-600 cursor-pointer transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4 line-clamp-2">
                                    {item.description}
                                </p>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto text-xs font-semibold text-gray-400">
                                <div className="flex items-center gap-4">
                                    {/* Likes */}
                                    <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                                        <Heart size={14} className="stroke-[2.5]" />
                                        <span>{item.likes}</span>
                                    </button>
                                    {/* Comments */}
                                    <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                                        <MessageSquare size={14} className="stroke-[2.5]" />
                                        <span>{item.comments}</span>
                                    </button>
                                </div>

                                {/* Share Button */}
                                <button className="flex items-center gap-1 hover:text-gray-600 transition-colors">
                                    <Share2 size={14} className="stroke-[2.5]" />
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* News Article Modal */}
            <ViewNewsSection
                item={selectedItem}
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
            />
        </div>
    );
}
