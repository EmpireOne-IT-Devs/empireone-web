import Card from "@/app/_components/card";
import React from "react";
import { TbChartBar, TbChecks, TbClock, TbClock24, TbListDetails, TbProgressCheck, TbTicket, TbUsersGroup } from "react-icons/tb";

export default function CardSection() {
    return (
        <div className="flex gap-3 w-full">
            <Card className="w-full flex-col gap-3">
                <div className="flex-row flex items-start justify-between">
                    <div className="bg-blue-600 p-3 rounded-xl w-16">
                        <TbTicket className="inline-block mr-2 text-4xl text-white" />
                    </div>
                    <div className="text-green-600 text-lg">15%</div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div>127</div>
                    <div className="font-black">Total Tickets</div>
                    <div className="text-sm">All time tickets handled</div>
                </div>
            </Card>
            <Card className="w-full flex-col gap-3">
                <div className="flex-row flex items-start justify-between">
                    <div className="bg-green-600 p-3 rounded-xl w-16">
                        <TbChecks className="inline-block mr-2 text-4xl text-white" />
                    </div>
                    <div className="text-green-600 text-lg">15%</div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div>43</div>
                    <div className="font-black">Resolved</div>
                    <div className="text-sm">92.8% resolution rate</div>
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
                    <div className="font-black">In Progress</div>
                    <div className="text-sm">Currently being handled</div>
                </div>
            </Card>
              <Card className="w-full flex-col gap-3">
                <div className="flex-row flex items-start justify-between">
                    <div className="bg-yellow-600 p-3 rounded-xl w-16">
                        <TbUsersGroup className="inline-block mr-2 text-4xl text-white" />
                    </div>
                    <div className="text-green-600 text-lg">15%</div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div>127</div>
                    <div className="font-black">Team Members</div>
                    <div className="text-sm">Avg satisfaction: 4.7/5.0</div>
                </div>
            </Card>
        </div>
    );
}
