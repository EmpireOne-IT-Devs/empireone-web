import Card from "@/app/_components/card";
import Indicator from "@/app/_components/indicator";
import React from "react";

export default function PriorityBreakdownSection() {
    return (
        <div className="flex flex-wrap">
            <div className="w-1/3 p-3">
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
                        <div>This Month</div>
                        <div className="underline text-blue-600">
                            73 Resolved
                        </div>
                    </div>
                </Card>
            </div>
            <div className="w-1/3 p-3">
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
                        <div>This Month</div>
                        <div className="underline text-blue-600">
                            73 Resolved
                        </div>
                    </div>
                </Card>
            </div>
            <div className="w-1/3 p-3">
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
                        <div>This Month</div>
                        <div className="underline text-blue-600">
                            73 Resolved
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
