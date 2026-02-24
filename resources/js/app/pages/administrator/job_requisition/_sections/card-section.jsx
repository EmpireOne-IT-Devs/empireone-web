import Card from "@/app/_components/card";
import { CheckCircle, Clipboard, Loader2, X, XCircleIcon } from "lucide-react";
import React from "react";
import { TbClock, TbRefresh } from "react-icons/tb";

export default function CardSection() {
    return (
        <div className="flex gap-3 w-full">
            <Card className="w-full p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <span className="text-md text-gray-600">
                        Total Requisitions
                    </span>
                    <div className="p-2 rounded-lg bg-blue-100">
                        <Clipboard className="text-xl text-blue-600" />
                    </div>
                </div>

                <div className="text-3xl font-bold text-blue-600">5</div>
            </Card>
            <Card className="w-full flex-col gap-3">
                <div className="flex-row flex items-start justify-between">
                    <span className="text-md text-gray-600">
                        Pending Review
                    </span>
                    <div className="p-2 rounded-lg bg-orange-100">
                        <TbClock className="text-2xl text-orange-600" />
                    </div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div className="text-3xl font-bold text-orange-500">2</div>
                </div>
            </Card>
            <Card className="w-full flex-col gap-3">
                <div className="flex-row flex items-start justify-between">
                    <span className="text-md text-gray-600">Approved</span>
                    <div className="p-2 rounded-lg bg-green-100">
                        <CheckCircle className="text-xl text-green-600" />
                    </div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div className="text-3xl font-bold text-green-600">1</div>
                </div>
            </Card>
            <Card className="w-full flex-col gap-3">
                <div className="flex-row flex items-start justify-between">
                    <span className="text-md text-gray-600">In Progress</span>
                    <div className="p-2 rounded-lg bg-purple-100">
                        <TbRefresh className="text-xl text-purple-600" />
                    </div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div className="text-3xl font-bold text-purple-600">2</div>
                </div>
            </Card>
             <Card className="w-full flex-col gap-3">
                <div className="flex-row flex items-start justify-between">
                    <span className="text-md text-gray-600">Declined</span>
                    <div className="p-2 rounded-lg bg-red-100">
                        <XCircleIcon className="text-xl text-red-600" />
                    </div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div className="text-3xl font-bold text-red-600">1</div>
                </div>
            </Card>
        </div>
    );
}
