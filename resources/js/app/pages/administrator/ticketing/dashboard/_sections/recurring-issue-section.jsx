import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Card from "@/app/_components/card";
import React from "react";
import { TbBulb, TbFileDownload } from "react-icons/tb";
import { TiWarningOutline } from "react-icons/ti";
export default function RecurringIssueSection() {
    return (
        <div className="bg-white shadow-2xl p-5 rounded-xl border border-gray-200">
            <div className="flex gap-3 py-2">
                <div className="flex-1 flex gap-3 items-start justify-start">
                    <TiWarningOutline className="text-orange-600 text-5xl" />
                    <div className="flex-col gap-2">
                        <div>Recurring Issues - Needs Permanent Solution</div>
                        <div className="text-sm text-gray-600">
                            Issues that repeatedly affect users and require
                            systemic fixes
                        </div>
                    </div>
                </div>
                <div>
                    <Button variant="primary" className="flex gap-2">
                        <TbFileDownload className="text-xl" /> Export
                    </Button>
                </div>
            </div>

            {[1, 2, 3, 4].map((res) => {
                return (
                    <Card
                        variant="warning"
                        outlined
                        className="bg-orange-50 border-2 my-3"
                    >
                        <div className="flex gap-3 py-3">
                            <div>
                                <TiWarningOutline className="text-orange-600 text-2xl" />
                            </div>
                            <div>Slow Performance on Accounting Software</div>
                            <div>
                                <Badge variant="danger" />
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="text-gray-600">Occurrences</div>
                                <div className="font-bold text-black">
                                    47 times
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="text-gray-600">
                                        Affected Users
                                    </div>
                                    <div className="font-bold text-black">
                                        47 times
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="text-gray-600">
                                        First Reported
                                    </div>
                                    <div className="font-bold text-black">
                                        47 times
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="text-gray-600">
                                        Last Occurrence
                                    </div>
                                    <div className="font-bold text-black">
                                        47 times
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Card
                            variant="primary"
                            outlined
                            className="my-3 bg-blue-100"
                        >
                            <div className="flex gap-3">
                                <div>
                                    <TbBulb className="text-blue-800 text-5xl" />
                                </div>
                                <div className="flex-1 flex-col gap-2">
                                    <div className="font-bold">
                                        Recommended Solution:
                                    </div>
                                    <div>
                                        Database optimization and server upgrade
                                        required.
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <div className="flex w-full items-center justify-between">
                            <div>
                                <Badge variant="secondary" label="Software" />
                            </div>
                            <div className="flex gap-3">
                                <Button>View All Tickets</Button>
                                <Button variant="success" outlined>
                                    View All Tickets
                                </Button>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
