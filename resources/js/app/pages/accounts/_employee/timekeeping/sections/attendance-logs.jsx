import moment from "moment";
import React, { useEffect, useState } from "react";
import { get_attendance_logs_service } from "@/app/services/attendance-service";

export default function AttendanceLogs({ refreshKey }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const res = await get_attendance_logs_service();
                setLogs(res.data.data ?? []);
            } catch {
                setLogs([]);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [refreshKey]);

    const resolveDisplayStatus = (log) => {
        if (log.display_status) return log.display_status;
        if (log.status === "clocked_out") {
            if (log.late_minutes > 0) return "Late";
            if (log.undertime_minutes > 0) return "Undertime";
            return "Present";
        }
        return log.status;
    };

    const getStatusBadge = (log) => {
        const status = resolveDisplayStatus(log);
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
            case "Clocked In":
                return (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                        Clocked In
                    </span>
                );
            case "On Break":
                return (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
                        On Break
                    </span>
                );
            default:
                return (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                        {status}
                    </span>
                );
        }
    };

    const formatTime = (t) =>
        t ? moment(t, "HH:mm:ss").format("hh:mm A") : "-";

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
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-400">
                                    Loading...
                                </td>
                            </tr>
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-400">
                                    No attendance records found.
                                </td>
                            </tr>
                        ) : (
                            logs.map((log, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {moment(log.date).format("LL")}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {formatTime(log.clock_in)}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {formatTime(log.clock_out)}
                                    </td>
                                    <td className="px-4 py-3">
                                        {getStatusBadge(log)}
                                    </td>
                                    <td className="px-4 py-3">{log.late_minutes}</td>
                                    <td className="px-4 py-3">
                                        {log.undertime_minutes}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
