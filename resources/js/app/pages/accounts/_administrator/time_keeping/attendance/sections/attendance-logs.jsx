import moment from "moment";
import React from "react";

export default function AttendanceLogs() {
    const logs = [
        {
            date: "2026-06-23",
            clockIn: "08:15 AM",
            clockOut: "05:00 PM",
            status: "Late",
            lateMinutes: 15,
            undertimeMinutes: 0,
            remarks: "Arrived 15 minutes late",
        },
        {
            date: "2026-06-22",
            clockIn: "08:00 AM",
            clockOut: "04:30 PM",
            status: "Undertime",
            lateMinutes: 0,
            undertimeMinutes: 30,
            remarks: "Left 30 minutes early",
        },
        {
            date: "2026-06-21",
            clockIn: "-",
            clockOut: "-",
            status: "Absent",
            lateMinutes: 0,
            undertimeMinutes: 0,
            remarks: "No attendance record",
        },
        {
            date: "2026-06-20",
            clockIn: "07:58 AM",
            clockOut: "05:05 PM",
            status: "Present",
            lateMinutes: 0,
            undertimeMinutes: 0,
            remarks: "On time",
        },
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case "Present":
                return (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        Present
                    </span>
                );
            case "Late":
                return (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                        Late
                    </span>
                );
            case "Undertime":
                return (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">
                        Undertime
                    </span>
                );
            case "Absent":
                return (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                        Absent
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <div className="flex justify-between">
                <h3 className="font-semibold text-gray-700 mb-3">
                    Attendance Logs
                </h3>
                <span className="text-sm text-gray-500 mt-1">
                    <b>Cutoff Date:</b> June 16 - June 30, 2026
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Clock In
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Clock Out
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Late (mins)
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Undertime (mins)
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {logs.map((log, index) => (
                            <tr key={index}>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {moment(log.date).format("LL")}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {log.clockIn}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {log.clockOut}
                                </td>
                                <td className="px-4 py-3">
                                    {getStatusBadge(log.status)}
                                </td>
                                <td className="px-4 py-3">{log.lateMinutes}</td>
                                <td className="px-4 py-3">
                                    {log.undertimeMinutes}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
