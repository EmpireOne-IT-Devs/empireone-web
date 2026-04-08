import Badge from "@/app/_components/badge";
import Card from "@/app/_components/card";
import React from "react";

export default function MostCommonIssueSection() {
    return (
        <Card className="flex-1 flex flex-col gap-3">
            <div className=" border-b-2 pb-2 mb-3 flex items-center justify-between">
                <div className="text-xl font-bold ">Most Common Issues</div>
                <div>Last 30 Days</div>
            </div>
            <div className="py-2">
                <div className="flex items-center justify-between ">
                    <div>Password Reset Request</div>
                    <div className="flex gap-3">
                        <div className="font-black">342</div>(28%)
                    </div>
                </div>
                <div className="flex gap-1 p-1">
                    <Badge variant="secondary">Account Access</Badge>
                    <div className="text-md">Avg Resolution: 15 min</div>
                </div>
                <div className="w-full bg-gray-400  rounded-full h-2">
                    <div
                        className="bg-brand h-2 rounded-full bg-blue-800"
                        style={{ width: "70%" }}
                    ></div>
                </div>
            </div>

            <div className="py-2">
                <div className="flex items-center justify-between ">
                    <div>Password Reset Request</div>
                    <div className="flex gap-3">
                        <div className="font-black">342</div>(28%)
                    </div>
                </div>
                <div className="flex gap-1 p-1">
                    <Badge  variant="secondary">
                        Account Access
                    </Badge>
                    <div className="text-md">Avg Resolution: 15 min</div>
                </div>
                <div className="w-full bg-gray-400  rounded-full h-2">
                    <div
                        className="bg-brand h-2 rounded-full bg-blue-800"
                        style={{ width: "40%" }}
                    ></div>
                </div>
            </div>
            <div className="py-2">
                <div className="flex items-center justify-between ">
                    <div>Password Reset Request</div>
                    <div className="flex gap-3">
                        <div className="font-black">342</div>(28%)
                    </div>
                </div>
                <div className="flex gap-1 p-1">
                    <Badge  variant="primary">
                        Account Access
                    </Badge>
                    <div className="text-md">Avg Resolution: 15 min</div>
                </div>
                <div className="w-full bg-gray-400  rounded-full h-2">
                    <div
                        className="bg-brand h-2 rounded-full bg-blue-800"
                        style={{ width: "80%" }}
                    ></div>
                </div>
            </div>
        </Card>
    );
}
