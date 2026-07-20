import React, { useState } from "react";
import { Search, Calendar, Download, Filter } from "lucide-react";

export default function TimeSheetSection() {
    const summary = [
        { title: "Working Days", value: 22 },
        { title: "Present", value: 20 },
        { title: "Late", value: 2 },
        { title: "Overtime", value: "14.5 hrs" },
    ];

    const data = [
        {
            employee: "Juan Dela Cruz",
            date: "July 20, 2026",
            in: "8:01 AM",
            breakOut: "12:00 PM",
            breakIn: "1:00 PM",
            out: "5:03 PM",
            hours: "8.0",
            status: "Present",
        },
        {
            employee: "Maria Santos",
            date: "July 20, 2026",
            in: "8:15 AM",
            breakOut: "12:03 PM",
            breakIn: "1:02 PM",
            out: "5:00 PM",
            hours: "7.7",
            status: "Late",
        },
    ];
    const [dateRange, setDateRange] = useState({
        startDate: "",
        endDate: "",
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Time Sheets</h1>
                <p className="text-gray-500">
                    View and manage employee attendance records.
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white border rounded-xl p-4">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[260px]">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search employee..."
                            className="w-full h-11 pl-10 pr-3 border rounded-lg focus:outline-none"
                        />
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={dateRange.startDate}
                            onChange={(e) =>
                                setDateRange({
                                    ...dateRange,
                                    startDate: e.target.value,
                                })
                            }
                            className="h-11 px-3 border rounded-lg"
                        />

                        <span className="text-gray-500">to</span>

                        <input
                            type="date"
                            value={dateRange.endDate}
                            min={dateRange.startDate}
                            onChange={(e) =>
                                setDateRange({
                                    ...dateRange,
                                    endDate: e.target.value,
                                })
                            }
                            className="h-11 px-3 border rounded-lg"
                        />
                    </div>

                    {/* Status */}
                    <select className="h-11 min-w-[170px] px-3 border rounded-lg">
                        <option>All Status</option>
                        <option>Present</option>
                        <option>Late</option>
                        <option>Absent</option>
                    </select>

                    {/* Filter */}
                    <button className="h-11 px-6 border rounded-lg flex items-center gap-2">
                        <Filter size={18} />
                        Filter
                    </button>

                    {/* Export */}
                    <button className="h-11 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2">
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            {/* Summary */}
            <div className="grid md:grid-cols-4 gap-4">
                {summary.map((item) => (
                    <div
                        key={item.title}
                        className="bg-white border rounded-xl p-5"
                    >
                        <p className="text-sm text-gray-500">{item.title}</p>
                        <h2 className="text-3xl font-bold mt-2">
                            {item.value}
                        </h2>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-5 py-3 text-left">Employee</th>
                            <th className="px-5 py-3 text-left">Date</th>
                            <th className="px-5 py-3 text-left">Time In</th>
                            <th className="px-5 py-3 text-left">Break Out</th>
                            <th className="px-5 py-3 text-left">Break In</th>
                            <th className="px-5 py-3 text-left">Time Out</th>
                            <th className="px-5 py-3 text-left">Hours</th>
                            <th className="px-5 py-3 text-left">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((row, index) => (
                            <tr
                                key={index}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="px-5 py-4">{row.employee}</td>
                                <td className="px-5 py-4">{row.date}</td>
                                <td className="px-5 py-4">{row.in}</td>
                                <td className="px-5 py-4">{row.breakOut}</td>
                                <td className="px-5 py-4">{row.breakIn}</td>
                                <td className="px-5 py-4">{row.out}</td>
                                <td className="px-5 py-4">{row.hours}</td>
                                <td className="px-5 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            row.status === "Present"
                                                ? "bg-green-100 text-green-700"
                                                : row.status === "Late"
                                                  ? "bg-yellow-100 text-yellow-700"
                                                  : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
