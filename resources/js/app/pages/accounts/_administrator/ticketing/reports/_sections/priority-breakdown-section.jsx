import Card from "@/app/_components/card";
import Indicator from "@/app/_components/indicator";
import React from "react";

export default function PriorityBreakdownSection() {
    return (
        <div className="flex flex-wrap bg-white shadow-lg rounded-lg">
            <div className="w-full p-3  text-md mt-4 ml-2">
                Priority Handling Breakdown by Personnel
            </div>
            <div className="w-1/3 p-4">
                <Card>
                    <div className="flex gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-full text-white flex items-center justify-center">
                            JM
                        </div>
                        <div className="flex flex-col items-start justify-center">
                            <div>John Martinez</div>
                            <div className="text-sm text-gray-500">
                                IT Support
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3  my-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <Indicator variant="danger" /> Critical
                            </div>
                            <div>15</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Indicator variant="warning" /> High
                            </div>
                            <div>15</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Indicator variant="primary" /> Medium
                            </div>
                            <div>15</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Indicator variant="success" /> Low
                            </div>
                            <div>15</div>
                        </div>
                    </div>
                    <hr />
                    <div className="flex items-center justify-between  my-3">
                        <div>This Month:</div>
                        <div className=" text-blue-600">
                            62 Resolved
                        </div>
                    </div>
                </Card>
            </div>
            <div className="w-1/3 p-4">
                <Card>
                    <div className="flex gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-full text-white flex items-center justify-center">
                            MR
                        </div>
                        <div className="flex flex-col items-start justify-center">
                            <div>Maria Santos</div>
                            <div className="text-sm text-gray-500">
                                IT Support
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3  my-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <Indicator variant="danger" /> Critical
                            </div>
                            <div>15</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Indicator variant="warning" /> High
                            </div>
                            <div>15</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Indicator variant="primary" /> Medium
                            </div>
                            <div>15</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Indicator variant="success" /> Low
                            </div>
                            <div>15</div>
                        </div>
                    </div>
                    <hr />
                    <div className="flex items-center justify-between  my-3">
                        <div>This Month:</div>
                        <div className=" text-blue-600">
                            81 Resolved
                        </div>
                    </div>
                </Card>
            </div>
            <div className="w-1/3 p-4">
                <Card>
                    <div className="flex gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-full text-white flex items-center justify-center">
                            RC
                        </div>
                        <div className="flex flex-col items-start justify-center">
                            <div>Robert Cruz</div>
                            <div className="text-sm text-gray-500">
                                Network Team
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3  my-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <Indicator variant="danger" /> Critical
                            </div>
                            <div>15</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Indicator variant="warning" /> High
                            </div>
                            <div>15</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Indicator variant="primary" /> Medium
                            </div>
                            <div>15</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Indicator variant="success" /> Low
                            </div>
                            <div>15</div>
                        </div>
                    </div>
                    <hr />
                    <div className="flex items-center justify-between  my-3">
                        <div>This Month:</div>
                        <div className=" text-blue-600">
                            58 Resolved
                        </div>
                    </div>
                </Card>
            </div>
               <div className="w-1/3 p-4">
                <Card>
                    <div className="flex gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-full text-white flex items-center justify-center">
                            LR
                        </div>
                        <div className="flex flex-col items-start justify-center">
                            <div>Lisa Reyes</div>
                            <div className="text-sm text-gray-500">
                                Hardware Team
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3  my-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <Indicator variant="danger" /> Critical
                            </div>
                            <div>15</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Indicator variant="warning" /> High
                            </div>
                            <div>15</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Indicator variant="primary" /> Medium
                            </div>
                            <div>15</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Indicator variant="success" /> Low
                            </div>
                            <div>15</div>
                        </div>
                    </div>
                    <hr />
                    <div className="flex items-center justify-between  my-3">
                        <div>This Month:</div>
                        <div className=" text-blue-600">
                            72 Resolved
                        </div>
                    </div>
                </Card>
            </div>
               <div className="w-1/3 p-4">
                <Card>
                    <div className="flex gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-full text-white flex items-center justify-center">
                            MT
                        </div>
                        <div className="flex flex-col items-start justify-center">
                            <div>John Martinez</div>
                            <div className="text-sm text-gray-500">
                                Software Team
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3  my-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <Indicator variant="danger" /> Critical
                            </div>
                            <div>15</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Indicator variant="warning" /> High
                            </div>
                            <div>15</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Indicator variant="primary" /> Medium
                            </div>
                            <div>15</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Indicator variant="success" /> Low
                            </div>
                            <div>15</div>
                        </div>
                    </div>
                    <hr />
                    <div className="flex items-center justify-between  my-3">
                        <div>This Month:</div>
                        <div className=" text-blue-600">
                            61 Resolved
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
