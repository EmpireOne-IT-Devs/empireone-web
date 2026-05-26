import React, { useState } from "react";
import {
    Newspaper,
    TrendingUp,
    Package,
    Users,
    ChevronRight,
} from "lucide-react";

const news = [
    {
        category: "Business",
        time: "5 hours ago",
        title: "Q4 Financial Results Exceed Expectations",
        icon: TrendingUp,
        gradient: "from-blue-500 to-indigo-600",
        shadow: "shadow-blue-200",
        tagBg: "bg-blue-50",
        tagText: "text-blue-600",
        tagRing: "ring-blue-200",
    },
    {
        category: "Product",
        time: "1 day ago",
        title: "New Product Launch: Innovation at Its Best",
        icon: Package,
        gradient: "from-green-400 to-emerald-500",
        shadow: "shadow-green-200",
        tagBg: "bg-green-50",
        tagText: "text-green-600",
        tagRing: "ring-green-200",
    },
    {
        category: "Customer",
        time: "2 days ago",
        title: "Customer Success Stories",
        icon: Users,
        gradient: "from-violet-500 to-purple-600",
        shadow: "shadow-purple-200",
        tagBg: "bg-violet-50",
        tagText: "text-violet-600",
        tagRing: "ring-violet-200",
    },
    {
        category: "Product",
        time: "1 day ago",
        title: "New Product Launch: Innovation at Its Best",
        icon: Package,
        gradient: "from-green-400 to-emerald-500",
        shadow: "shadow-green-200",
        tagBg: "bg-green-50",
        tagText: "text-green-600",
        tagRing: "ring-green-200",
    },
];

export default function TopNewsCardSection() {
    const [hovered, setHovered] = useState(null);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                        <Newspaper size={15} className="text-gray-600" />
                    </div>
                    <span className="text-sm font-bold text-gray-800">
                        Top News
                    </span>
                </div>
                <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                    {news.length} articles
                </span>
            </div>

            {/* News list */}
            <div className="flex flex-col gap-1 p-3 flex-1">
                {news.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={index}
                            onMouseEnter={() => setHovered(index)}
                            onMouseLeave={() => setHovered(null)}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                hovered === index
                                    ? "bg-gray-50 scale-[1.01]"
                                    : "bg-white"
                            }`}
                        >
                            {/* Gradient icon bubble */}
                            <div
                                className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-md ${item.shadow}`}
                            >
                                <Icon size={16} className="text-white" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate leading-snug">
                                    {item.title}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span
                                        className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ring-1 ${item.tagBg} ${item.tagText} ${item.tagRing}`}
                                    >
                                        {item.category}
                                    </span>
                                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                                    <span className="text-xs text-gray-400">
                                        {item.time}
                                    </span>
                                </div>
                            </div>

                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${hovered === index ? "bg-gray-200" : "bg-gray-100"}`}
                            >
                                <ChevronRight
                                    size={13}
                                    className="text-gray-500"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="mx-3 mb-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-orange-900 text-center cursor-pointer hover:opacity-90 transition-opacity shadow-sm shadow-gray-300">
                <button className="text-xs font-bold text-white tracking-wide">
                    Read More News →
                </button>
            </div>
        </div>
    );
}
