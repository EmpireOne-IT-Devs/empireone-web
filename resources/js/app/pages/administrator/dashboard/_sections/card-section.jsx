import React from "react";
import { CalendarDays, Clipboard, Mail, TicketIcon } from "lucide-react";
export default function CardSection() {
    return (
        <div className="flex gap-3 w-full mt-8">
            <card className="w-full flex-col gap-3 bg-blue-50 rounded-lg p-4  rounded-lg transition-all hover:shadow-lg  lg:col-span-3 cursor-pointer border border-gray-50">
                <div className="flex-row flex items-start justify-between">
                    <div className=" p-3  w-16">
                        <TicketIcon className="inline-block mr-2 text-6xl text-blue-700 " />
                    </div>
                    <div className="text-3xl mt-4 text-blue-900">3</div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div className="text-gray-700 text-md -mt-2">
                        My Open Tickets
                    </div>
                </div>
            </card>
            <card className="w-full flex-col gap-3 bg-green-50 rounded-lg p-4  rounded-lg transition-all hover:shadow-lg  lg:col-span-3 cursor-pointer border border-gray-50">
                <div className="flex-row flex items-start justify-between">
                    <div className=" p-3 rounded-xl w-16">
                        <Clipboard className="inline-block mr-2 text-6xl text-green-600    " />
                    </div>
                    <div className="text-3xl mt-4 text-green-600   ">2</div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div className="text-gray-700 text-md -mt-2">Pending Applications</div>
                </div>
            </card>
            <card className="w-full flex-col gap-3 bg-orange-50 rounded-lg p-4  rounded-lg transition-all hover:shadow-lg  lg:col-span-3 cursor-pointer border border-gray-50">
                <div className="flex-row flex items-start justify-between">
                    <div className=" p-3 rounded-xl w-16">
                        <CalendarDays className="inline-block mr-2 text-6xl text-orange-300" />
                    </div>
                    <div className="text-3xl mt-4 text-orange-500">4</div>
                </div>
                <div className="flex-col flex items-start justify-between">
                    <div className="text-gray-700 text-md -mt-2 mb-2">Upcoming Events</div>
                </div>
            </card>
            <card className="w-full flex-col gap-3 bg-red-50 rounded-lg p-4  rounded-lg transition-all hover:shadow-lg  lg:col-span-3 cursor-pointer border border-gray-50">
                <div className="flex-row flex items-start justify-between">
                    <div className=" p-3 rounded-xl w-16">
                        <Mail className="inline-block mr-2 text-6xl text-orange-500" />
                    </div>
                    <div className="text-3xl mt-4 text-red-500">7</div>
                </div>
                <div className="flex-col flex items-start justify-between ">
                    <div className="text-gray-700 text-md -mt-2">Unread Messages</div>
                </div>
            </card>
        </div>
    );
}
