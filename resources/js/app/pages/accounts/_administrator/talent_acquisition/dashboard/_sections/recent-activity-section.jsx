import Card from "@/app/_components/card";
import React, { useEffect, useState } from "react";
import { get_ta_recent_activity_service } from "@/app/services/job-posting-service";
import { CalendarIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { LuUsers } from "react-icons/lu";
import { FiBriefcase } from "react-icons/fi";

const TYPE_CONFIG = {
    application: {
        icon: <LuUsers className="w-4 h-4 text-blue-600" />,
        bg: "bg-blue-100",
        dot: "bg-blue-500",
    },
    schedule: {
        icon: <CalendarIcon className="w-4 h-4 text-purple-600" />,
        bg: "bg-purple-100",
        dot: "bg-purple-500",
    },
    posting: {
        icon: <FiBriefcase className="w-4 h-4 text-green-600" />,
        bg: "bg-green-100",
        dot: "bg-green-500",
    },
    log: {
        icon: <DocumentTextIcon className="w-4 h-4 text-yellow-600" />,
        bg: "bg-yellow-100",
        dot: "bg-yellow-500",
    },
};

const DEFAULT_CONFIG = {
    icon: <DocumentTextIcon className="w-4 h-4 text-gray-500" />,
    bg: "bg-gray-100",
    dot: "bg-gray-400",
};

export default function RecentActivitySection() {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        get_ta_recent_activity_service()
            .then(setActivities)
            .catch(console.error);
    }, []);

    return (
        <Card className="flex-1 flex flex-col gap-3 p-6">
            <div className="pb-3 mb-1 flex items-center justify-between border-b border-gray-100">
                <div className="text-xl font-bold">Recent Activity</div>
                <span className="text-xs text-gray-400 font-medium">Latest {activities.length} events</span>
            </div>

            <div className="overflow-y-auto max-h-72 pr-1">
                {activities.length === 0 && (
                    <div className="text-sm text-gray-400 text-center py-10">No recent activity.</div>
                )}

                <div className="flex flex-col">
                    {activities.map((item, index) => {
                        const config = TYPE_CONFIG[item.type] ?? DEFAULT_CONFIG;
                        const isLast = index === activities.length - 1;
                        return (
                            <div key={index} className="flex gap-3">
                                {/* Timeline line + icon */}
                                <div className="flex flex-col items-center">
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${config.bg}`}>
                                        {config.icon}
                                    </div>
                                    {!isLast && (
                                        <div className="w-px flex-1 bg-gray-200 my-1" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className={`pb-4 flex-1 min-w-0 ${isLast ? "" : ""}`}>
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm font-medium text-gray-900 leading-snug">
                                            {item.label}
                                        </p>
                                        <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                                            {item.time}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                        <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                                        <span className="text-xs text-gray-500">{item.user}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
}
