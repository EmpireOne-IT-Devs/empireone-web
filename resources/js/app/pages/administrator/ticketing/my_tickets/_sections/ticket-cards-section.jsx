import Badge from "@/app/_components/badge";
import Card from "@/app/_components/card";
import React from "react";
import { TbCalendarEvent, TbMapPin, TbTag, TbUser } from "react-icons/tb";

export default function TicketCardsSection() {
    return (
        <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((res, i) => {
                return (
                    <Card key={i} className="border-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-3">
                                <div className="underline text-blue-600">
                                    TKT-2024-001
                                </div>
                                <Badge
                                    variant="danger"
                                    outlined
                                    label="Critical"
                                />
                                <Badge
                                    variant="primary"
                                    outlined
                                    label="In Progress"
                                />
                            </div>
                            <div className="flex w-full items-center justify-between">
                                <div>
                                    Network connectivity issue in Conference
                                    Room A
                                </div>
                                <div className="flex-1 flex  items-end justify-end flex-col">
                                    <div className="text-sm">
                                        Expected Resolution
                                    </div>
                                    <div className="text-md">15 minutes</div>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="flex-1 items-start justify-start flex gap-3">
                                    <TbTag className="text-xl" /> Network Issue
                                </div>
                                <div className="flex-1 items-start justify-start flex gap-3">
                                    <TbMapPin className="text-xl" /> Manila HQ
                                </div>
                                <div className="flex-1 items-start justify-start flex gap-3">
                                    <TbUser className="text-xl" /> Assigned:
                                    Robert Cruz
                                </div>
                                <div className="flex-1 items-start justify-start flex gap-3">
                                    <TbCalendarEvent className="text-xl" />{" "}
                                    2024-12-08 09:30 AM
                                </div>
                                <div className="flex-1 flex  items-end justify-end flex-col">
                                    <div className="text-sm">Last Updated</div>
                                    <div className="text-sm">
                                        2024-12-08 11:30 AM
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="w-full bg-gray-400  rounded-full h-2">
                                    <div
                                        className="bg-brand h-2 rounded-full bg-blue-800"
                                        style={{ width: "70%" }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
