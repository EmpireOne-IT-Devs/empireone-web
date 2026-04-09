import Card from "@/app/_components/card";
import { CheckCircle, Clock, Ticket } from "lucide-react";
import React from "react";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FiUsers } from "react-icons/fi";

export default function CardSection() {
    return (
        <div className="flex gap-3 w-full">
            <Card className="w-full flex-col gap-3">
                <div className="flex items-start justify-between">
                    <div className="bg-blue-200 p-4 rounded-xl w-16 flex items-center justify-center">
                        <Ticket className="text-4xl text-blue-600" />
                    </div>

                    <div className="flex items-center gap-1 text-green-600">
                        <FaArrowTrendUp className="text-lg" />
                        <span className="text-md"> +15%</span>
                    </div>
                </div>
                <div className="flex flex-col items-start">
                    <div>Total Tickets</div>
                    <div className="mt-2 mb-2 text-3xl font-bold">789</div>
                    <div className="text-sm">All time tickets handled</div>
                </div>
            </Card>

            <Card className="w-full flex-col gap-3">
                <div className="flex-row flex items-start justify-between">
                    <div className="bg-green-200 p-4 rounded-xl w-16">
                        <CheckCircle className="text-4xl text-green-600" />
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                        <FaArrowTrendUp className="text-lg" />
                        <span className="text-md"> +8%</span>
                    </div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div>Resolved</div>
                    <div className="mt-2 mb-2 text-3xl font-bold">732</div>
                    <div className="text-sm">92.8% resolution rate</div>
                </div>
            </Card>
            <Card className="w-full flex-col gap-3">
                <div className="flex-row flex items-start justify-between">
                    <div className="bg-orange-200 p-4 rounded-xl w-16">
                        <Clock className="text-4xl text-orange-600" />
                    </div>
                    <div className="text-red-600 text-md">26 pending</div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div>In Progress</div>
                    <div className="mt-2 mb-2 text-3xl font-bold">31</div>

                    <div className="text-sm">Currently being handled</div>
                </div>
            </Card>
            <Card className="w-full flex-col gap-3">
                <div className="flex-row flex items-start justify-between">
                    <div className="bg-purple-200 p-4 rounded-xl w-16">
                        <FiUsers className="text-2xl text-purple-600" />
                    </div>

                    <div className="text-green-600 text-md">3 Active</div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div>Team Members</div>
                    <div className="mt-2 mb-2 text-3xl font-bold">5</div>

                    <div className="text-sm">Avg satisfaction: 4.7/5.0</div>
                </div>
            </Card>
        </div>
    );
}
