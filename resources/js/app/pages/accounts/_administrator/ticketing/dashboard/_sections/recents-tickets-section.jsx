import Badge from "@/app/_components/badge";
import Card from "@/app/_components/card";
import React from "react";
import { TbTicket } from "react-icons/tb";

export default function RecentsTicketsSection() {
    const recentTickets = [
        {
            id: "TKT-1045",
            title: "Network connectivity issues",
            requester: "John Doe",
            timeAgo: "5 min ago",
            status: "Open",
            statusVariant: "danger",
            priority: "High",
            priorityVariant: "danger",
            iconBg: "bg-red-600",
        },
        {
            id: "TKT-1044",
            title: "Password reset request",
            requester: "Jane Smith",
            timeAgo: "15 min ago",
            status: "In Progress",
            statusVariant: "primary",
            priority: "Medium",
            priorityVariant: "secondary",
            iconBg: "bg-blue-600",
        },
        {
            id: "TKT-1043",
            title: "Software installation needed",
            requester: "Mike Johnson",
            timeAgo: "1 hour ago",
            status: "Pending",
            statusVariant: "secondary",
            priority: "Low",
            priorityVariant: "success",
            iconBg: "bg-purple-600",
        },
        {
            id: "TKT-1042",
            title: "Email configuration problem",
            requester: "Sarah Williams",
            timeAgo: "2 hours ago",
            status: "Open",
            statusVariant: "danger",
            priority: "High",
            priorityVariant: "danger",
            iconBg: "bg-orange-600",
        },
    ];

    return (
        <Card>
            <div className="border-b-2 border-gray-200 pb-3 mb-3">
                <div className="text-xl font-bold text-gray-800">
                    Recent Tickets
                </div>
            </div>

            <div className="flex flex-col gap-2">
                {recentTickets.map((ticket, index) => (
                    <div
                        key={index}
                        className="border-b border-gray-200 last:border-b-0 py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                        <div className="flex w-full gap-3 items-center">
                            <div>
                                <TbTicket
                                    className={`text-4xl ${ticket.iconBg} rounded-full p-2 text-white shadow-md`}
                                />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <div className="text-base font-semibold text-gray-800">
                                        {ticket.title}
                                    </div>
                                    <Badge
                                        variant={ticket.statusVariant}
                                        label={ticket.status}
                                    />
                                    <Badge
                                        variant={ticket.priorityVariant}
                                        label={ticket.priority}
                                    />
                                </div>

                                <div className="text-sm text-gray-600">
                                    {ticket.id} • {ticket.requester} •{" "}
                                    {ticket.timeAgo}
                                </div>
                            </div>

                            <div className="underline text-blue-600 font-medium cursor-pointer hover:text-blue-700 transition-colors">
                                View
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
