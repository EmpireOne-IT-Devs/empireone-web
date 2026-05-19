import Card from "@/app/_components/card";
import React, { useEffect, useState } from "react";
import { TbChartBar, TbClock, TbClock24, TbListDetails } from "react-icons/tb";
import { FiBriefcase } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import { FaArrowTrendUp } from "react-icons/fa6";
import { CalendarIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { get_ta_dashboard_stats_service } from "@/app/services/job-posting-service";
import { router } from "@inertiajs/react";

export default function CardSection() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        get_ta_dashboard_stats_service().then(setStats).catch(console.error);
    }, []);

    return (
        <div className="flex flex-col md:flex-row gap-3 w-full">
            <Card 
                onClick={() => router.visit('/accounts/administrator/talent_acquisition/job_posting')}
                className="w-full md:w-1/4 flex-col gap-3 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
                <div className="flex-row flex items-start justify-between">
                    <div className="bg-blue-600 p-3 rounded-xl w-16">
                        <FiBriefcase className="inline-block mr-2 text-4xl text-white" />
                    </div>
                    <FaArrowTrendUp className="text-green-600 text-lg" />
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div>{stats?.active_postings ?? "—"}</div>
                    <div className="text-gray-600">Active Postings</div>
                    <div className="text-green-500 mt-2">+ {stats?.new_postings_this_week ?? "—"} this week</div>
                </div>
            </Card>
            <Card 
                onClick={() => router.visit('/accounts/administrator/talent_acquisition/applicants')}
                className="w-full md:w-1/4 flex-col gap-3 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
                <div className="flex-row flex items-start justify-between">
                    <div className="bg-green-600 p-3 rounded-xl w-16">
                        <LuUsers className="inline-block mr-2 text-4xl text-white" />
                    </div>
                    <FaArrowTrendUp className="text-green-600 text-lg" />
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div>{stats?.total_applicants ?? "—"}</div>
                    <div className="text-gray-600">Total Applicants</div>
                    <div className="text-green-500 mt-2">+ {stats?.new_applicants_this_week ?? "—"} this week</div>
                </div>
            </Card>
            <Card 
                onClick={() => router.visit('/accounts/administrator/talent_acquisition/calendar')}
                className="w-full md:w-1/4 flex-col gap-3 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
                <div className="flex-row flex items-start justify-between">
                    <div className="bg-purple-700 p-3 rounded-xl w-16">
                        <CalendarIcon className="inline-block mr-2 text-4xl text-white" />
                    </div>
                    <FaArrowTrendUp className="text-green-600 text-lg" />
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div>{stats?.interviews_scheduled ?? "—"}</div>
                    <div className="text-gray-600">Interviews Scheduled</div>
                    <div className="text-green-500 mt-2">{stats?.interviews_this_week ?? "—"} this week</div>
                </div>
            </Card>
            <Card 
                onClick={() => router.visit('/accounts/administrator/talent_acquisition/job_requisition')}
                className="w-full md:w-1/4 flex-col gap-3 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
                <div className="flex-row flex items-start justify-between">
                    <div className="bg-orange-600 p-3 rounded-xl w-16">
                        <CheckCircleIcon className="inline-block mr-2 text-4xl text-white" />
                    </div>
                    <FaArrowTrendUp className="text-green-600 text-lg" />
                </div>
                <div className="flex-col flex items-start justify-between ">
                    <div>{stats?.total_requisitions ?? "—"}</div>
                    <div className="text-gray-600">Total Requisitions</div>
                    <div className="text-green-500 mt-2">+ {stats?.new_requisitions_this_week ?? "—"} this week</div>
                </div>
            </Card>
        </div>
    );
}
