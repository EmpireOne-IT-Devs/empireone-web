import { time } from "framer-motion";
import { useState } from "react";

export default function TicketTableSection() {
    const data = [
        {
            ticket_id: "IT091225003072",
            requestor: "Boss Kyle",
            category: "IT Support",
            location: "Manila HQ",
            assigned_to: "Wakin Hojilla",
            priority: "High",
            status: "pending",
            date_created: "2025-12-01",
            time_created: "10:15 AM",
        },
        {
            ticket_id: "HR091225003073",
            requestor: "Jane Doe",
            category: "HR",
            location: "Cebu Office",
            assigned_to: "Mark Santos",
            priority: "Medium",
            status: "in_progress",
            date_created: "2025-12-02",
            time_created: "09:30 AM",
        },
        {
            ticket_id: "FIN091225003074",
            requestor: "John Smith",
            category: "Finance",
            location: "Manila HQ",
            assigned_to: "Liza Tan",
            priority: "Low",
            status: "closed",
            date_created: "2025-12-03",
            time_created: "02:45 PM",
        },
        {
            ticket_id: "IT091225003075",
            requestor: "Alice Johnson",
            category: "IT Support",
            location: "Davao Office",
            assigned_to: "Wakin Hojilla",
            priority: "High",
            status: "in_progress",
            date_created: "2025-12-04",
            time_created: "11:00 AM",
        },
        {
            ticket_id: "HR091225003076",
            requestor: "Carlos Reyes",
            category: "HR",
            location: "Manila HQ",
            assigned_to: "Mark Santos",
            priority: "Low",
            status: "pending",
            date_created: "2025-12-05",
            time_created: "03:15 PM",
        },
        {
            ticket_id: "FIN091225003077",
            requestor: "Samantha Cruz",
            category: "Finance",
            location: "Cebu Office",
            assigned_to: "Liza Tan",
            priority: "High",
            status: "closed",
            date_created: "2025-12-06",
            time_created: "08:45 AM",
        },
        {
            ticket_id: "IT091225003078",
            requestor: "Tom Hardy",
            category: "IT Support",
            location: "Manila HQ",
            assigned_to: "Wakin Hojilla",
            priority: "Medium",
            status: "pending",
            date_created: "2025-12-07",
            time_created: "01:30 PM",
        },
        {
            ticket_id: "HR091225003079",
            requestor: "Linda Gomez",
            category: "HR",
            location: "Davao Office",
            assigned_to: "Mark Santos",
            priority: "High",
            status: "in_progress",
            date_created: "2025-12-08",
            time_created: "10:50 AM",
        },
        {
            ticket_id: "FIN091225003080",
            requestor: "Michael Tan",
            category: "Finance",
            location: "Manila HQ",
            assigned_to: "Liza Tan",
            priority: "Medium",
            status: "pending",
            date_created: "2025-12-09",
            time_created: "11:20 AM",
        },
        {
            ticket_id: "IT091225003081",
            requestor: "Rachel Adams",
            category: "IT Support",
            location: "Cebu Office",
            assigned_to: "Wakin Hojilla",
            priority: "Low",
            status: "closed",
            date_created: "2025-12-10",
            time_created: "04:05 PM",
        },
    ];

    // Status map
    const statusMap = {
        pending: {
            label: "Pending",
            className: "bg-orange-100 text-orange-700",
        },
        in_progress: {
            label: "In Progress",
            className: "bg-blue-100 text-blue-700",
        },
        closed: { label: "Closed", className: "bg-green-100 text-green-700" },
    };

    // Priority map
    const priorityMap = {
        high: { label: "High", className: "bg-red-100 text-red-700" },
        medium: { label: "Medium", className: "bg-yellow-100 text-yellow-700" },
        low: { label: "Low", className: "bg-green-100 text-green-700" },
    };

    const getStatusBadge = (status) => {
        const key = status.toLowerCase().replace(" ", "_");
        return (
            statusMap[key] || {
                label: status,
                className: "bg-gray-100 text-gray-700",
            }
        );
    };

    const getPriorityBadge = (priority) => {
        const key = priority.toLowerCase();
        return (
            priorityMap[key] || {
                label: priority,
                className: "bg-gray-100 text-gray-700",
            }
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-full">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-4 px-4 text-md font-bold text-gray-700">
                                Ticket No.
                            </th>
                            <th className="text-left py-4 px-4 text-md font-bold text-gray-700">
                                Requestor
                            </th>
                            <th className="text-left py-4 px-4 text-md font-bold text-gray-700">
                                Category
                            </th>
                            <th className="text-left py-4 px-4 text-md font-bold text-gray-700">
                                Location
                            </th>
                            <th className="text-left py-4 px-4 text-md font-bold text-gray-700">
                                Assigned To
                            </th>
                            <th className="text-left py-4 px-4 text-md font-bold text-gray-700">
                                Priority
                            </th>
                            <th className="text-left py-4 px-4 text-md font-bold text-gray-700">
                                Status
                            </th>
                            <th className="text-left py-4 px-4 text-md font-bold text-gray-700">
                                Date Created
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((ticket) => {
                            const statusBadge = getStatusBadge(ticket.status);
                            const priorityBadge = getPriorityBadge(
                                ticket.priority,
                            );

                            return (
                                <tr
                                    key={ticket.ticket_id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-4 px-4 text-sm font-medium underline text-blue-700 cursor-pointer">
                                        {ticket.ticket_id}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-700">
                                        {ticket.requestor}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-700">
                                        {ticket.category}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-700">
                                        {ticket.location}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-700">
                                        {ticket.assigned_to}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold ${priorityBadge.className}`}
                                        >
                                            {priorityBadge.label}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold ${statusBadge.className}`}
                                        >
                                            {statusBadge.label}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-700">
                                        {ticket.date_created}{" "}
                                        {ticket.time_created}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
