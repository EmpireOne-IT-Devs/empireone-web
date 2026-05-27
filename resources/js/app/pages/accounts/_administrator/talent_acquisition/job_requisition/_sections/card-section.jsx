import Card from "@/app/_components/card";
import { CheckCircle, Clipboard, XCircleIcon } from "lucide-react";
import React, { useEffect } from "react";
import { TbClock, TbRefresh } from "react-icons/tb";
import { useSelector } from "react-redux";
import store from "@/app/store/store";
import { get_job_requisitions_thunk } from "@/app/redux/job-requisition-thunk";
import { router } from "@inertiajs/react";

export default function CardSection() {
    const { stats } = useSelector((state) => state.job_requisitions);

    const handleCardClick = (statusFilter) => {
        const params = new URLSearchParams(window.location.search);
        const queryParams = {};
        const currentSearch = params.get("search");

        if (currentSearch) {
            queryParams.search = currentSearch;
        }

        if (statusFilter !== "all") {
            queryParams.status = statusFilter;
        }

        router.get(window.location.pathname, queryParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const cards = [
        {
            label: "Total Requisitions",
            value: stats?.total ?? 0,
            icon: Clipboard,
            iconColor: "text-blue-600",
            bgColor: "bg-blue-100",
            valueColor: "text-blue-600",
            filterValue: "all",
        },
        {
            label: "Pending Review",
            value: stats?.pending ?? 0,
            icon: TbClock,
            iconColor: "text-orange-600",
            bgColor: "bg-orange-100",
            valueColor: "text-orange-500",
            filterValue: "Pending",
        },
        {
            label: "Approved",
            value: stats?.approved ?? 0,
            icon: CheckCircle,
            iconColor: "text-green-600",
            bgColor: "bg-green-100",
            valueColor: "text-green-600",
            filterValue: "Final Approved",
        },
        {
            label: "In Progress",
            value: stats?.in_progress ?? 0,
            icon: TbRefresh,
            iconColor: "text-purple-600",
            bgColor: "bg-purple-100",
            valueColor: "text-purple-600",
            filterValue: "In Progress",
        },
        {
            label: "Declined",
            value: stats?.declined ?? 0,
            icon: XCircleIcon,
            iconColor: "text-red-600",
            bgColor: "bg-red-100",
            valueColor: "text-red-600",
            filterValue: "Declined",
        },
    ];

    return (
        <div className="flex gap-3 w-full flex-wrap ">
            {cards.map((card, index) => {
                const Icon = card.icon;

                return (
                    <Card
                        key={index}
                        onClick={() => handleCardClick(card.filterValue)}
                        className="p-5 border w-full flex-1 border-gray-100 shadow-sm rounded-xl bg-white h-full flex flex-col justify-between cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-md text-gray-600">
                                {card.label}
                            </span>
                            <div className={`p-2 rounded-lg ${card.bgColor}`}>
                                <Icon className={`text-xl ${card.iconColor}`} />
                            </div>
                        </div>

                        {/* Removed the unnecessary wrapper div here */}
                        <div
                            className={`text-3xl font-bold ${card.valueColor}`}
                        >
                            {card.value}
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
