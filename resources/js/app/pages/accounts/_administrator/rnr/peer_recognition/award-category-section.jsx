import React, { useState } from "react";
import {
    Award,
    Medal,
    Lightbulb,
    Sparkles,
    Users,
    HeartHandshake,
    GraduationCap,
} from "lucide-react";

const tabs = [
    {
        label: "All Awards",
        icon: Award,
    },
    {
        label: "Employee of the Month",
        icon: Medal,
    },
    {
        label: "Innovation Award",
        icon: Lightbulb,
    },
    {
        label: "Rising Star Award",
        icon: Sparkles,
    },
    {
        label: "Team Excellence Award",
        icon: Users,
    },
    {
        label: "Customer Champion Award",
        icon: HeartHandshake,
    },
    {
        label: "Mentor of the Quarter",
        icon: GraduationCap,
    },
];

export default function AwardCategorySection({ onChange }) {
    const [activeTab, setActiveTab] = useState(tabs[0].label);

    const handleTabClick = (tab) => {
        setActiveTab(tab.label);

        if (typeof onChange === "function") {
            onChange(tab.label);
        }
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
                {tabs.map((tab) => {
                    const Icon = tab.icon;

                    return (
                        <button
                            key={tab.label}
                            type="button"
                            onClick={() => handleTabClick(tab)}
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                                activeTab === tab.label
                                    ? "bg-orange-600 text-white shadow-sm"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}