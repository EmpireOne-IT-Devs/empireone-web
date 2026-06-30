import React from "react";
import Card from "@/app/_components/card";
import {
    TbCalendarEvent,
    TbClipboardList,
    TbCheck,
    TbX,
    TbTrendingUp,
} from "react-icons/tb";

const cards = [
    {
        title: "Total Events",
        value: 5,
        icon: TbCalendarEvent,
        color: "text-blue-600",
        bg: "bg-blue-500",
    },
    {
        title: "Survey Responses",
        value: 5,
        icon: TbClipboardList,
        color: "text-white",
        bg: "bg-violet-500",
    },
    {
        title: "Active",
        value: 0,
        icon: TbCheck,
        color: "text-white",
        bg: "bg-emerald-500",
    },
    {
        title: "Inactive",
        value: 5,
        icon: TbX,
        color: "text-white",
        bg: "bg-orange-500",
    },
];

export default function CardSection() {
    return (
        <div className="flex flex-col sm:flex-row gap-4 my-3">
            {cards.map((card, index) => {
                const Icon = card.icon;

                return (
                    <Card
                        key={index}
                        className="flex-1 flex flex-col gap-3 rounded-2xl border border-gray-200 shadow-sm"
                        padding="p-5"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}
                                >
                                    <Icon className="text-2xl text-white" />
                                </div>

                                <span className="text-2xl font-bold text-gray-900 leading-none">
                                    {card.value}
                                </span>
                            </div>

                            <TbTrendingUp className="text-green-500 text-lg" />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mt-1">
                                {card.title}
                            </p>
                        </div>

                      
                    </Card>
                );
            })}
        </div>
    );
}
