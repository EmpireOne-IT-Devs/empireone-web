import React from "react";
import {
    BarChart3,
    Vote,
    CheckCircle2,
    XCircle,
    Calculator,
} from "lucide-react";
import Card from "@/app/_components/card";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { get_poll_analytics_dashboard_thunk } from "@/app/redux/activities-thunk";

export default function PollStatsCard() {
    const dispatch = useDispatch();
    const { pollDashboard } = useSelector((state) => state.activities);

    useEffect(() => {
        dispatch(get_poll_analytics_dashboard_thunk());
    }, [dispatch]);

    const totalPolls = pollDashboard?.total_polls ?? 0;
    const totalVotes = pollDashboard?.total_votes ?? 0;
    const mostSelected = pollDashboard?.most_selected_option?.label ?? "N/A";
    const participation = pollDashboard?.participation_rate ?? 0;
    const highestEngagement =
        pollDashboard?.poll_with_highest_engagement?.poll_id ?? "N/A";

    const stats = [
        {
            id: 1,
            title: `${totalPolls}`,
            description: "Total Polls",
            icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
            bgIcon: "bg-blue-50",
        },
        {
            id: 2,
            title: `${totalVotes}`,
            description: "Total Votes",
            icon: <Vote className="w-5 h-5 text-purple-600" />,
            bgIcon: "bg-purple-50",
        },
        {
            id: 3,
            title: `${participation}%`,
            description: "Participation Rate",
            icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
            bgIcon: "bg-green-50",
        },
        {
            id: 4,
            title: `${mostSelected}`,
            description: "Most Selected Option",
            icon: <XCircle className="w-5 h-5 text-gray-600" />,
            bgIcon: "bg-gray-50",
        },
        {
            id: 5,
            title: `${highestEngagement}`,
            description: "Highest Engagement Poll",
            icon: <Calculator className="w-5 h-5 text-amber-600" />,
            bgIcon: "bg-amber-50",
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-4 w-full font-sans antialiased">
            {stats.map((stat) => (
                <div key={stat.id} className="flex w-full">
                    <Card className="w-full p-6 bg-white rounded-2xl shadow-sm transition-all duration-200">
                        <div className="flex items-center gap-3">
                            <div
                                className={`p-2 rounded-xl ${stat.bgIcon} shrink-0`}
                            >
                                {stat.icon}
                            </div>

                            <span className="text-2xl font-bold text-gray-900 tracking-tight">
                                {stat.title}
                            </span>
                        </div>

                        <p className="mt-2 ml-1 text-sm font-semibold text-gray-600 tracking-wide">
                            {stat.description}
                        </p>
                    </Card>
                </div>
            ))}
        </div>
    );
}
