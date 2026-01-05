import Badge from "@/app/_components/badge";
import Card from "@/app/_components/card";
import React from "react";
import { TbTicket } from "react-icons/tb";

export default function RecentsTicketsSection() {
    return (
        <Card>
            <div className="text-black font-black text-2xl">
                Recents Tickets
            </div>
            {[1, 2, 3, 4].map((res) => {
                return (
                    <div className=" border-b-2 px-2">
                        <div className="flex w-full gap-3 my-3">
                            <div>
                                <TbTicket className="text-5xl bg-blue-600 rounded-full m-3 p-2 text-white" />
                            </div>
                            <div className="flex-1 flex gap-3 items-center">
                                <div className="flex-col">
                                    <div className="flex gap-2">
                                        <div className="text-lg">
                                            Network connectivity issues
                                        </div>
                                        <Badge variant="danger" label="Open" />
                                        <Badge variant="danger" label="high" />
                                    </div>

                                    <div className="text-gray-600">
                                        TKT-1045 • John Doe • 5 min ago
                                    </div>
                                </div>
                            </div>
                            <div className="underline text-blue-600 text-xl">
                                View
                            </div>
                        </div>
                    </div>
                );
            })}
        </Card>
    );
}
