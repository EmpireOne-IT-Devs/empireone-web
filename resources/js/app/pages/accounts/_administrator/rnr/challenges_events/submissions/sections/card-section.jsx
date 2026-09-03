import Card from "@/app/_components/card";
import React from "react";
import {
    TbClockHour4,
    TbRefresh,
    TbCircleCheck,
    TbCircleX,
} from "react-icons/tb";

const cards = [
    {
        label: "Pending Review",
        value: 0,
        icon: TbClockHour4,
        iconClassName: "text-sky-500",
    },
    {
        label: "Revision Sent",
        value: 0,
        icon: TbRefresh,
        iconClassName: "text-fuchsia-500",
    },
    {
        label: "Approved",
        value: 1,
        icon: TbCircleCheck,
        iconClassName: "text-emerald-500",
    },
    {
        label: "Rejected",
        value: 0,
        icon: TbCircleX,
        iconClassName: "text-rose-500",
    },
];

export default function CardSection() {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 mt-6">
            {cards.map(({ label, value, icon: Icon, iconClassName }) => (
                <Card key={label} className="w-full text-center">
                    <div className="flex flex-col items-center gap-2">
                        <Icon className={`text-2xl ${iconClassName}`} />
                        <div className="text-xl font-semibold leading-none">
                            {value}
                        </div>
                        <div className="text-sm text-gray-500">{label}</div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
