import Card from "@/app/_components/card";
import React from "react";
import { TbChartBar, TbClock, TbClock24, TbListDetails } from "react-icons/tb";

export default function CardSection() {
    return (
        <div className="flex gap-3 w-full">
            <Card className="w-full flex-col gap-3">
                <div className="flex-row flex items-start justify-between">
                    <div className="bg-red-600 p-3 rounded-xl w-16">
                        <TbListDetails className="inline-block mr-2 text-4xl text-white" />
                    </div>
                    <div className="text-green-600 text-lg">15%</div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div>127</div>
                    <div>Open Tickets</div>
                </div>
            </Card>
            <Card className="w-full flex-col gap-3">
                <div className="flex-row flex items-start justify-between">
                    <div className="bg-green-600 p-3 rounded-xl w-16">
                        <TbChartBar className="inline-block mr-2 text-4xl text-white" />
                    </div>
                    <div className="text-green-600 text-lg">15%</div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div>43</div>
                    <div>Resolved Today</div>
                </div>
            </Card>
            <Card className="w-full flex-col gap-3">
                <div className="flex-row flex items-start justify-between">
                    <div className="bg-orange-600 p-3 rounded-xl w-16">
                        <TbClock className="inline-block mr-2 text-4xl text-white" />
                    </div>
                    <div className="text-green-600 text-lg">15%</div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div>127</div>
                    <div>Pending Review</div>
                </div>
            </Card>
            <Card className="w-full flex-col gap-3">
                <div className="flex-row flex items-start justify-between">
                    <div className="bg-blue-600 p-3 rounded-xl w-16">
                        <TbClock24 className="inline-block mr-2 text-4xl text-white" />
                    </div>
                    <div className="text-green-600 text-lg">15%</div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div>127</div>
                    <div>Avg Response Time</div>
                </div>
            </Card>
        </div>
    );
}
