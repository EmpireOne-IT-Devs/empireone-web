import Card from "@/app/_components/card";
import React from "react";
import { TbChartBar, TbClock, TbClock24, TbListDetails } from "react-icons/tb";
import { FiBriefcase } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import { FaArrowTrendUp } from "react-icons/fa6";
import { CalendarIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
export default function CardSection() {
    return (
        <div className="flex gap-3 w-full">
            <Card className="w-full flex-col gap-3 ">
                <div className="flex-row flex items-start justify-between">
                    <div className="bg-blue-600 p-3 rounded-xl w-16">
                        <FiBriefcase className="inline-block mr-2 text-4xl text-white" />
                    </div>
                    <FaArrowTrendUp className="text-green-600 text-lg" />
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div>3</div>
                    <div className="text-gray-600">Active Postings</div>
                    <div className="text-green-500 mt-2">+ 2 this week</div>
                </div>
            </Card>
            <Card className="w-full flex-col gap-3">
                <div className="flex-row flex items-start justify-between">
                    <div className="bg-green-600 p-3 rounded-xl w-16">
                        <LuUsers className="inline-block mr-2 text-4xl text-white" />
                    </div>
                    <FaArrowTrendUp className="text-green-600 text-lg" />
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div>192</div>
                    <div className="text-gray-600">Total Applicants</div>
                    <div className="text-green-500 mt-2">+ 18% this week</div>
                </div>
            </Card>
            <Card className="w-full flex-col gap-3">
                <div className="flex-row flex items-start justify-between">
                    <div className="bg-purple-700 p-3 rounded-xl w-16">
                        <CalendarIcon className="inline-block mr-2 text-4xl text-white" />
                    </div>
                    <FaArrowTrendUp className="text-green-600 text-lg" />
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div>24</div>
                    <div className="text-gray-600">Interviews Scheduled</div>
                    <div className="text-green-500 mt-2">8 this week</div>
                </div>
            </Card>
            <Card className="w-full flex-col gap-3">
                <div className="flex-row flex items-start justify-between">
                    <div className="bg-orange-600 p-3 rounded-xl w-16">
                        <CheckCircleIcon className="inline-block mr-2 text-4xl text-white" />
                    </div>
                    <FaArrowTrendUp className="text-green-600 text-lg" />
                </div>
                <div className="flex-col flex items-start justify-between ">
                    <div>1</div>
                    <div className="text-gray-600">Positions Filled</div>
                    <div className="text-green-500 mt-2">3 this months</div>
                </div>
            </Card>
        </div>
    );
}
