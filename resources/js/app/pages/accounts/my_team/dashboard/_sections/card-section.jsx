import React from "react";
import { Briefcase, Clipboard, InboxIcon, Users } from "lucide-react";
import Card from "@/app/_components/card";

export default function CardSection() {
    return (
        <div className="flex gap-3 w-full flex-wrap">
            <Card className="p-5 border w-full flex-1 border-gray-100 shadow-sm rounded-xl bg-white h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-700">
                        <Briefcase size={28} />
                    </div>
                    <div className="text-3xl font-bold text-blue-900">8</div>
                </div>
                <div className="mt-4 text-sm font-medium text-gray-500">
                    Regular
                </div>
            </Card>

            <Card className="p-5 border w-full flex-1 border-gray-100 shadow-sm rounded-xl bg-white h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                    <div className="p-3 bg-green-50 rounded-lg text-green-600">
                        <Clipboard size={28} />
                    </div>
                    <div className="text-3xl font-bold text-green-700">4</div>
                </div>
                <div className="mt-4 text-sm font-medium text-gray-500">
                    Probationary
                </div>
            </Card>

            <Card className="p-5 border w-full flex-1 border-gray-100 shadow-sm rounded-xl bg-white h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                    <div className="p-3 bg-orange-50 rounded-lg text-orange-500">
                        <InboxIcon size={28} />
                    </div>
                    <div className="text-3xl font-bold text-orange-600">2</div>
                </div>
                <div className="mt-4 text-sm font-medium text-gray-500">
                    Pending Regularization
                </div>
            </Card>
            <Card className="p-5 border w-full flex-1 border-gray-100 shadow-sm rounded-xl bg-white h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                    <div className="p-3 bg-orange-50 rounded-lg text-orange-500">
                        <Users size={28} />
                    </div>
                    <div className="text-3xl font-bold text-orange-600">2</div>
                </div>
                <div className="mt-4 text-sm font-medium text-gray-500">
                    Total Team Members
                </div>
            </Card>
        </div>
    );
}
