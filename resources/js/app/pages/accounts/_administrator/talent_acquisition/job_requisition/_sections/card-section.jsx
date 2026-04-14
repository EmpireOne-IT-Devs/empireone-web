import Card from "@/app/_components/card";
import { CheckCircle, Clipboard, XCircleIcon } from "lucide-react";
import React from "react";
import { TbClock, TbRefresh } from "react-icons/tb";
import { useSelector } from "react-redux";

export default function CardSection() {
    const { stats } = useSelector((state) => state.job_requisitions);

    // Grouping the config into an array keeps the JSX clean and scalable
    const cards = [
        {
            label: "Total Requisitions",
            value: stats?.total ?? 0,
            icon: Clipboard,
            iconColor: "text-blue-600",
            bgColor: "bg-blue-100",
            valueColor: "text-blue-600",
        },
        {
            label: "Pending Review",
            value: stats?.pending ?? 0,
            icon: TbClock,
            iconColor: "text-orange-600",
            bgColor: "bg-orange-100",
            valueColor: "text-orange-500",
        },
        {
            label: "Approved",
            value: stats?.approved ?? 0,
            icon: CheckCircle,
            iconColor: "text-green-600",
            bgColor: "bg-green-100",
            valueColor: "text-green-600",
        },
        {
            label: "In Progress",
            value: stats?.in_progress ?? 0,
            icon: TbRefresh,
            iconColor: "text-purple-600",
            bgColor: "bg-purple-100",
            valueColor: "text-purple-600",
        },
        {
            label: "Declined",
            value: stats?.declined ?? 0,
            icon: XCircleIcon,
            iconColor: "text-red-600",
            bgColor: "bg-red-100",
            valueColor: "text-red-600",
        },
    ];

    return (
        <div className="flex gap-3 w-full flex-wrap ">
            {cards.map((card, index) => {
                const Icon = card.icon;

                return (
                    <Card className="p-5 border w-full flex-1 border-gray-100 shadow-sm rounded-xl bg-white h-full flex flex-col justify-between">
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
