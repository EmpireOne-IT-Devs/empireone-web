import React from "react";
import { TrendingUp, Sparkles, Building2, Fingerprint } from "lucide-react";

const actions = [
    {
        label: "View Activities",
        icon: <Sparkles size={22} className="text-blue-500" />,
        bgColor: "bg-blue-50",
    },
    {
        label: "Job Posting",
        icon: <Building2 size={22} className="text-yellow-500" />,
        bgColor: "bg-yellow-50",
    },
    {
        label: "Clock In",
        icon: <Fingerprint size={22} className="text-green-500" />,
        bgColor: "bg-green-50",
    },
    {
        label: "Clock Out",
        icon: <Fingerprint size={22} className="text-red-400" />,
        bgColor: "bg-red-50",
    },
];

export default function QuickActionSection() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">
                    Quick Actions
                </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {actions.map((action) => (
                    <button
                        key={action.label}
                        className="flex flex-col items-center gap-3 py-5 rounded-xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition cursor-pointer bg-white"
                    >
                        <div
                            className={`w-11 h-11 flex items-center justify-center rounded-xl ${action.bgColor}`}
                        >
                            {action.icon}
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                            {action.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
