import React, { useState } from "react";

const tabs = [
    "All Awards",
    "Employee of the Month",
    "Innovation Award",
    "Rising Star",
    "Team Excellence Award",
    "Customer Champion",
    "Mentor of the Quarter",
];

export default function AwardCategorySection() {
    const [activeTab, setActiveTab] = useState(tabs[0]);

    return (
        <div>
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                            activeTab === tab
                                ? "bg-orange-600 text-white shadow-sm"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
}
