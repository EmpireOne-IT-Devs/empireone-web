import React from "react";
import { Briefcase, Clipboard, InboxIcon, Mail } from "lucide-react";
import Card from "@/app/_components/card";
import { useSelector } from "react-redux";

export default function CardSection() {
    const { data } = useSelector((store) => store.app);

    return (
        /* REMOVE 'flex' from this outer div. 
           'grid' is much more reliable for enforcing specific column counts.
        */
        <div className="flex gap-3 w-full flex-wrap ">
            
            {/* Total Job Openings */}
            <Card className="p-5 border w-full flex-1 border-gray-100 shadow-sm rounded-xl bg-white h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-700">
                        <Briefcase size={28} />
                    </div>
                    <div className="text-3xl font-bold text-blue-900">
                        {data?.dashboard?.total_job_opening ?? 0}
                    </div>
                </div>
                <div className="mt-4 text-sm font-medium text-gray-500">
                    Total Job Openings
                </div>
            </Card>

            {/* Applications Submitted */}
            <Card className="p-5 border w-full flex-1 border-gray-100 shadow-sm rounded-xl bg-white h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                    <div className="p-3 bg-green-50 rounded-lg text-green-600">
                        <Clipboard size={28} />
                    </div>
                    <div className="text-3xl font-bold text-green-700">
                        {data?.dashboard?.total_application_submitted ?? 0}
                    </div>
                </div>
                <div className="mt-4 text-sm font-medium text-gray-500">
                    Applications Submitted
                </div>
            </Card>

            {/* Job Offers Received */}
            <Card className="p-5 border w-full flex-1 border-gray-100 shadow-sm rounded-xl bg-white h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                    <div className="p-3 bg-orange-50 rounded-lg text-orange-500">
                        <InboxIcon size={28} />
                    </div>
                    <div className="text-3xl font-bold text-orange-600">
                        {data?.dashboard?.total_job_offer ?? 0}
                    </div>
                </div>
                <div className="mt-4 text-sm font-medium text-gray-500">
                    Job Offers Received
                </div>
            </Card>

            {/* Unread Messages */}
            <Card className="p-5 border w-full flex-1 border-gray-100 shadow-sm rounded-xl bg-white h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                    <div className="p-3 bg-red-50 rounded-lg text-red-500">
                        <Mail size={28} />
                    </div>
                    <div className="text-3xl font-bold text-red-600">0</div>
                </div>
                <div className="mt-4 text-sm font-medium text-gray-500">
                    Unread Messages
                    <span className="text-[10px] text-gray-400 block xl:inline ml-0 xl:ml-1">
                        (coming soon)
                    </span>
                </div>
            </Card>
        </div>
    );
}