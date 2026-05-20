import Card from "@/app/_components/card";
import React from "react";

export default function IssuesByCategorySection() {
    const categories = [
        {
            name: "Network",
            count: 379,
            percentage: 32,
            color: "bg-blue-600",
            progressColor: "bg-blue-600",
        },
        {
            name: "Account Access",
            count: 298,
            percentage: 25,
            color: "bg-purple-600",
            progressColor: "bg-purple-600",
        },
        {
            name: "Software",
            count: 215,
            percentage: 18,
            color: "bg-green-600",
            progressColor: "bg-green-600",
        },
        {
            name: "Email",
            count: 187,
            percentage: 16,
            color: "bg-orange-600",
            progressColor: "bg-orange-600",
        },
        {
            name: "Hardware",
            count: 108,
            percentage: 9,
            color: "bg-red-600",
            progressColor: "bg-red-600",
        },
    ];

    return (
        <Card>
            <div className="border-b-2 border-gray-200 pb-3 mb-1 flex items-center justify-between">
                <div className="text-xl font-bold text-gray-800">
                    Issues by Category
                </div>
                <div className="text-sm text-gray-500 font-medium">
                    Last 30 Days
                </div>
            </div>

            <div className="flex flex-col gap-3">
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className="py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex gap-2 items-center">
                                <div
                                    className={`w-3 h-3 ${category.color} rounded-full shadow-sm`}
                                ></div>
                                <div className="font-semibold text-gray-800">
                                    {category.name}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-lg text-gray-900">
                                    {category.count}
                                </span>
                                <span className="text-sm text-gray-500">
                                    ({category.percentage}%)
                                </span>
                            </div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                                className={`${category.progressColor} h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm`}
                                style={{ width: `${category.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
