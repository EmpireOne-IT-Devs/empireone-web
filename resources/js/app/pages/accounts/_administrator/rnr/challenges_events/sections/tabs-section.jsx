import React, { useState } from "react";
import {
    LayoutDashboard,
    Settings,
    Trophy,
    BarChart3,
    FileText,
} from "lucide-react";

export default function TabsSection({ onChange }) {
    const tabs = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Manage",
            icon: Settings,
        },
        {
            label: "Leaderboard",
            icon: Trophy,
        },
        {
            label: "Analytics",
            icon: BarChart3,
        },
        {
            label: "Reports",
            icon: FileText,
        },
    ];

    const [activeTab, setActiveTab] = useState(tabs[0].label);

    const handleTabClick = (tab) => {
        setActiveTab(tab.label);

        if (typeof onChange === "function") {
            onChange(tab.label);
        }
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3 mt-6">
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
