import React from "react";
import { Newspaper } from "lucide-react";

const news = [
    {
        category: "Business",
        categoryColor: "text-blue-700 bg-blue-50 border-blue-200",
        time: "5 hours ago",
        title: "Q4 Financial Results Exceed Expectations",
    },
    {
        category: "Product",
        categoryColor: "text-green-700 bg-green-50 border-green-200",
        time: "1 day ago",
        title: "New Product Launch: Innovation at Its Best",
    },
    {
        category: "Customer",
        categoryColor: "text-purple-700 bg-purple-50 border-purple-200",
        time: "2 days ago",
        title: "Customer Success Stories",
    },
];

export default function TopNewsCardSection() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-5">
                <Newspaper size={20} className="text-gray-600" />
                <span className="text-lg font-bold text-gray-800">
                    Top News
                </span>
            </div>
            <div className="flex flex-col gap-5">
                {news.map((item) => (
                    <div key={item.title}>
                        <div className="flex items-center gap-2 mb-1">
                            <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded border ${item.categoryColor}`}
                            >
                                {item.category}
                            </span>
                            <span className="text-xs text-gray-400">
                                {item.time}
                            </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-800">
                            {item.title}
                        </p>
                    </div>
                ))}
            </div>
            <button className="w-full mt-5 py-2.5 text-sm font-semibold text-blue-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                Read More News
            </button>
        </div>
    );
}
