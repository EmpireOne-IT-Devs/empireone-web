import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import SearchSection from "./search-section";

export default function TableSection() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDepartment, setSelectedDepartment] =
        useState("All Departments");

    const data = [
        {
            id: 1,
            name: "John Martinez",
            email: "john.martinez@company.com",
            initials: "JM",
            department: "IT Support",
            status: "Available",
            total: 156,
            resolved: 142,
            pending: 8,
            inProgress: 6,
            avgTime: "2.5 hrs",
            satisfaction: 4.8,
            thisWeek: 18,
        },
        {
            id: 2,
            name: "Maria Santos",
            email: "maria.santos@company.com",
            initials: "MS",
            department: "IT Support",
            status: "Busy",
            total: 189,
            resolved: 175,
            pending: 5,
            inProgress: 9,
            avgTime: "1.8 hrs",
            satisfaction: 4.9,
            thisWeek: 22,
        },
        {
            id: 3,
            name: "Robert Cruz",
            email: "robert.cruz@company.com",
            initials: "RC",
            department: "Network Team",
            status: "Available",
            total: 134,
            resolved: 125,
            pending: 4,
            inProgress: 5,
            avgTime: "3.2 hrs",
            satisfaction: 4.6,
            thisWeek: 15,
        },
        {
            id: 4,
            name: "Lisa Reyes",
            email: "lisa.reyes@company.com",
            initials: "LR",
            department: "Hardware Team",
            status: "Available",
            total: 167,
            resolved: 158,
            pending: 3,
            inProgress: 6,
            avgTime: "2.1 hrs",
            satisfaction: 4.7,
            thisWeek: 20,
        },
        {
            id: 5,
            name: "Michael Tan",
            email: "michael.tan@company.com",
            initials: "MT",
            department: "Software Team",
            status: "Away",
            total: 143,
            resolved: 132,
            pending: 6,
            inProgress: 5,
            avgTime: "2.8 hrs",
            satisfaction: 4.5,
            thisWeek: 16,
        },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            Available: "bg-green-100 text-green-700",
            Busy: "bg-red-100 text-red-700",
            Away: "bg-gray-100 text-gray-700",
        };
        return styles[status] || styles.Available;
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 w-full">
            <div>
                <SearchSection />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                                Personnel
                            </th>
                            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                                Department
                            </th>
                            <th className="text-left py-4 px-4 text-sm font-semiboldF text-gray-700">
                                Status
                            </th>
                            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                                Total
                            </th>
                            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                                Resolved
                            </th>
                            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                                Pending
                            </th>
                            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                                In Progress
                            </th>
                            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                                Avg Time
                            </th>
                            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                                Satisfaction
                            </th>
                            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                                This Week
                            </th>
                            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((person) => (
                            <tr
                                key={person.id}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                                            {person.initials}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 text-sm">
                                                {person.name}
                                            </div>
                                            <div className="text-gray-500 text-xs">
                                                {person.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-700">
                                    {person.department}
                                </td>
                                <td className="py-4 px-4">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(person.status)}`}
                                    >
                                        {person.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-sm font-medium text-gray-900">
                                    {person.total}
                                </td>
                                <td className="py-4 px-4 text-sm font-medium text-green-600">
                                    {person.resolved}
                                </td>
                                <td className="py-4 px-4 text-sm font-medium text-orange-600">
                                    {person.pending}
                                </td>
                                <td className="py-4 px-4 text-sm font-medium text-blue-600">
                                    {person.inProgress}
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-700">
                                    {person.avgTime}
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-1">
                                        <span className="text-yellow-500">
                                            ⭐
                                        </span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {person.satisfaction}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">
                                            {person.thisWeek}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            tickets
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium ">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
