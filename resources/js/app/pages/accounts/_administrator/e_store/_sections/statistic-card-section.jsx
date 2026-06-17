import React from "react";
import { CubeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { ShoppingBag, DollarSign } from "lucide-react";
import { FaArrowTrendUp } from "react-icons/fa6";
import Card from "@/app/_components/card";

const STATS_DATA = [
    {
        id: 1,
        value: "5",
        label: "Total Items",
        iconBg: "bg-blue-600",
        icon: <CubeIcon className="inline-block text-4xl text-white w-8 h-8" />,
    },
    {
        id: 2,
        value: "5",
        label: "Active Items",

        iconBg: "bg-green-600",
        icon: (
            <CheckCircleIcon className="inline-block text-4xl text-white w-8 h-8" />
        ),
    },
    {
        id: 3,
        value: "477",
        label: "Total Redemptions",

        iconBg: "bg-purple-700",
        icon: (
            <ShoppingBag className="inline-block text-4xl text-white w-8 h-8" />
        ),
    },
    {
        id: 4,
        value: "123,090",
        label: "Points Redeemed",

        iconBg: "bg-orange-600",
        icon: (
            <DollarSign className="inline-block text-4xl text-white w-8 h-8" />
        ),
    },
];

export default function StatisticCardSection() {
    return (
        <div className="flex flex-col md:flex-row gap-3 w-full">
            {STATS_DATA.map((stat) => (
                <Card
                    key={stat.id}
                    className="w-full md:w-1/4 flex-col gap-3 cursor-default transition-all duration-200 hover:shadow-lg hover:scale-105"
                >
                    <div className="flex-row flex items-start justify-between">
                        <div
                            className={`${stat.iconBg} p-3 rounded-xl w-16 flex items-center justify-center`}
                        >
                            {stat.icon}
                        </div>
                        <FaArrowTrendUp className="text-green-600 text-lg" />
                    </div>
                    <div className="flex-col flex items-start justify-between">
                        <div className="text-xl font-bold text-gray-900">
                            {stat.value}
                        </div>
                        <div className="text-gray-600">{stat.label}</div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
