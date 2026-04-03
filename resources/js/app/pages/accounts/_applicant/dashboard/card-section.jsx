import React from "react";
import { Briefcase, Clipboard, InboxIcon, Mail } from "lucide-react";
import Card from "@/app/_components/card";
export default function CardSection() {
    return (
        <div className="flex gap-3 w-full mt-8">
            <Card className="w-full flex-col gap-3  p-4   lg:col-span-3 ">
                <div className="flex-row flex items-start justify-between">
                    <div className=" p-3  w-16">
                        <Briefcase className="inline-block mr-2 text-6xl text-blue-700 " />
                    </div>
                    <div className="text-3xl mt-4 text-blue-900">3</div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div className="text-gray-700 text-md -mt-2">
                        Total Job Openings
                    </div>
                </div>
            </Card>
            <Card className="w-full flex-col gap-3 p-4   lg:col-span-3  ">
                <div className="flex-row flex items-start justify-between">
                    <div className=" p-3 rounded-xl w-16">
                        <Clipboard className="inline-block mr-2 text-6xl text-green-600    " />
                    </div>
                    <div className="text-3xl mt-4 text-green-600   ">2</div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div className="text-gray-700 text-md -mt-2">
                        Applications Submitted
                    </div>
                </div>
            </Card>
            <Card className="w-full flex-col gap-3  p-4   lg:col-span-3  ">
                <div className="flex-row flex items-start justify-between">
                    <div className=" p-3 rounded-xl w-16">
                        <InboxIcon className="inline-block mr-2 text-6xl text-orange-300" />
                    </div>
                    <div className="text-3xl mt-4 text-orange-500">4</div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div className="text-gray-700 text-md -mt-2 mb-2">
                        Job Offers Received
                    </div>
                </div>
            </Card>
            <Card className="w-full flex-col gap-3  p-4  lg:col-span-3 cursor-pointer ">
                <div className="flex-row flex items-start justify-between">
                    <div className=" p-3 rounded-xl w-16">
                        <Mail className="inline-block mr-2 text-6xl text-orange-500" />
                    </div>
                    <div className="text-3xl mt-4 text-red-500">7</div>
                </div>
                <div className="flex-col flex items-start justify-between ">
                    <div className="text-gray-700 text-md -mt-2">
                        Unread Messages
                    </div>
                </div>
            </Card>
        </div>
    );
}
