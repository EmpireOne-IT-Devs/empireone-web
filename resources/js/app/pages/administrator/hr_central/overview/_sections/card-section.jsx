import Card from "@/app/_components/card";
import React from "react";
import { LuUsers } from "react-icons/lu";
import { Briefcase, Calendar, UserCheckIcon } from "lucide-react";
export default function CardSection() {
    return (
        <div className="flex gap-3 w-full">
            <Card className="w-full flex-col gap-3 ">
                <div className="flex-row flex items-start justify-between">
                    <div className="bg-blue-600 p-4 rounded-xl w-15">
                        <LuUsers className="inline-block text-2xl text-white" />
                    </div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div className="text-gray-600">Total Employees</div>
                    <div className="text-black mt-2">248</div>
                </div>
            </Card>
            <Card className="w-full flex-col gap-3">
                <div className="flex-row flex items-start justify-between">
                    <div className="bg-green-600 p-4 rounded-xl w-15">
                        <Briefcase className="inline-block  text-4xl text-white" />
                    </div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div className="text-gray-600">Open Positions</div>
                    <div className="text-black mt-2">12</div>
                </div>
            </Card>
            <Card className="w-full flex-col gap-3">
                <div className="flex-row flex items-start justify-between">
                    <div className="bg-yellow-500 p-4 rounded-xl w-15">
                        <Calendar className="inline-block  text-2xl text-white" />
                    </div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div className="text-gray-600">Pending Leaves</div>
                    <div className="text-black mt-2">8</div>
                </div>
            </Card>
            <Card className="w-full flex-col gap-3">
                <div className="flex-row flex items-start justify-between">
                    <div className="bg-purple-600 p-4 rounded-xl w-15">
                        <UserCheckIcon className="inline-block  text-2xl text-white" />
                    </div>
                </div>
                <div className="flex-col flex items-start justify-between ">
                    <div className="text-gray-600">New Hires (Month)</div>
                    <div className="text-black mt-2">5</div>
                </div>
            </Card>
        </div>
    );
}
