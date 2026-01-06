import React from "react";
import Card from "@/app/_components/card";
import { FaCalendar } from "react-icons/fa6";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function CardSection() {
    return (
        <div className="flex gap-8 w-full">
            <Card className="w-full flex flex-col justify-between p-6 bg-white rounded-xl shadow-sm">
                <div className="flex items-center justify-between w-full">
                    <div className="text-gray-700">Upcoming Interviews</div>
                    <div className="bg-blue-100 rounded-xl p-3 flex items-center justify-center">
                        <FaCalendar className="w-7 h-7 text-blue-600" />
                    </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">0</div>
            </Card>

            <Card className="w-full flex flex-col justify-between p-6 bg-white rounded-xl shadow-sm">
                <div className="flex items-center justify-between w-full">
                    <div className="text-gray-700">Today's Interviews</div>
                    <div className="bg-green-100 rounded-xl p-3 flex items-center justify-center">
                        <ClockIcon className="w-7 h-7 text-green-600" />
                    </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">0</div>
            </Card>

            <Card className="w-full flex flex-col justify-between p-6 bg-white rounded-xl shadow-sm">
                <div className="flex items-center justify-between w-full">
                    <div className="text-gray-700">Completed</div>
                    <div className="bg-purple-100 rounded-xl p-3 flex items-center justify-center">
                        <CheckCircleIcon className="w-7 h-7 text-purple-600" />
                    </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">1</div>
            </Card>
        </div>
    );
}
