import React from "react";
import { Zap, Sparkles, Building2, Fingerprint } from "lucide-react";

const actions = [
    { label: "View Activities", icon: Sparkles, iconColor: "text-blue-500", bg: "bg-blue-50" },
    { label: "Job Posting", icon: Building2, iconColor: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "Clock In", icon: Fingerprint, iconColor: "text-green-500", bg: "bg-green-50" },
    { label: "Clock Out", icon: Fingerprint, iconColor: "text-red-400", bg: "bg-red-50" },
];

export default function QuickActionSection() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Zap size={15} className="text-blue-600" />
                </div>
                <span className="text-sm font-bold text-gray-800">Quick Actions</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3">
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={action.label}
                            className="flex flex-col items-center gap-3 py-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all duration-150 cursor-pointer"
                        >
                            <div className={`w-11 h-11 flex items-center justify-center rounded-xl ${action.bg}`}>
                                <Icon size={20} className={action.iconColor} />
                            </div>
                            <span className="text-xs font-medium text-gray-700">
                                {action.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
