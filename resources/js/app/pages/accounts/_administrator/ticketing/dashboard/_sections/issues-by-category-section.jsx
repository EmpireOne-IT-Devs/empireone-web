import Card from "@/app/_components/card";
import React from "react";

export default function IssuesByCategorySection() {
    return (
        <Card>
            <div className=" border-b-2 pb-2 mb-3 flex items-center justify-between">
                <div className="text-xl font-bold ">Issues by Category</div>
                <div>Last 30 Days</div>
            </div>
            <div className="py-2">
                <div className="flex items-center justify-between ">
                    <div className="flex gap-2 items-center justify-center">
                        <div className="w-3 bg-blue-600 rounded-full h-3"></div>
                        <div>Network</div>
                    </div>
                    <div className="flex gap-3">
                        <div className="font-black">379</div>(70%)
                    </div>
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
                    <div className="flex gap-2 items-center justify-center">
                        <div className="w-3 bg-purple-600 rounded-full h-3"></div>
                        <div>Account Access</div>
                    </div>
                    <div className="flex gap-3">
                        <div className="font-black">379</div>(40%)
                    </div>
                </div>
                <div className="w-full bg-gray-400  rounded-full h-2">
                    <div
                        className="bg-brand h-2 rounded-full bg-purple-800"
                        style={{ width: "40%" }}
                    ></div>
                </div>
            </div>
            <div className="py-2">
                <div className="flex items-center justify-between ">
                    <div className="flex gap-2 items-center justify-center">
                        <div className="w-3 bg-green-600 rounded-full h-3"></div>
                        <div>Software</div>
                    </div>
                    <div className="flex gap-3">
                        <div className="font-black">379</div>(20%)
                    </div>
                </div>
                <div className="w-full bg-gray-400  rounded-full h-2">
                    <div
                        className="bg-brand h-2 rounded-full bg-green-800"
                        style={{ width: "20%" }}
                    ></div>
                </div>
            </div>
            <div className="py-2">
                <div className="flex items-center justify-between ">
                    <div className="flex gap-2 items-center justify-center">
                        <div className="w-3 bg-orange-600 rounded-full h-3"></div>
                        <div>Email</div>
                    </div>
                    <div className="flex gap-3">
                        <div className="font-black">379</div>(90%)
                    </div>
                </div>
                <div className="w-full bg-gray-400  rounded-full h-2">
                    <div
                        className="bg-brand h-2 rounded-full bg-orange-800"
                        style={{ width: "90%" }}
                    ></div>
                </div>
            </div>
            <div className="py-2">
                <div className="flex items-center justify-between ">
                    <div className="flex gap-2 items-center justify-center">
                        <div className="w-3 bg-red-600 rounded-full h-3"></div>
                        <div>Hardware</div>
                    </div>
                    <div className="flex gap-3">
                        <div className="font-black">379</div>(20%)
                    </div>
                </div>
                <div className="w-full bg-gray-400  rounded-full h-2">
                    <div
                        className="bg-brand h-2 rounded-full bg-red-800"
                        style={{ width: "20%" }}
                    ></div>
                </div>
            </div>
        </Card>
    );
}
