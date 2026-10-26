import React from "react";
import moment from "moment";
import { CalendarX2 } from "lucide-react";
import { motion } from "framer-motion";
import Skeleton from "@/app/_components/skeleton";

const BADGE_STYLES = {
    Present: "bg-green-100 text-green-700",
    Late: "bg-yellow-100 text-yellow-700",
    Undertime: "bg-orange-100 text-orange-700",
    "Clocked In": "bg-blue-100 text-blue-700",
    "On Break": "bg-yellow-100 text-yellow-700",
    "Day Off": "bg-purple-100 text-purple-700",
    "On Leave": "bg-teal-100 text-teal-700",
    Absent: "bg-red-100 text-red-700",
};

export const statusOf = (log) => {
    if (log.display_status) return log.display_status;
    if (log.status === "clocked_out") {
        if (log.late_minutes > 0) return "Late";
        if (log.undertime_minutes > 0) return "Undertime";
        return "Present";
    }
    return log.status;
};

const formatPunch = (value) => (value ? moment(value).format("hh:mm A") : "-");

const workedHours = (log) => {
    if (!log.clock_in_at || !log.clock_out_at) return "-";

    const minutes =
        moment(log.clock_out_at).diff(moment(log.clock_in_at), "minutes") -
        (log.breaktime_minutes ?? 0);

    return minutes > 0 ? (minutes / 60).toFixed(1) : "0.0";
};

export default function AttendanceHistorySection({
    logs,
    loading,
    cutoffLabel,
    cutoffDate,
}) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-semibold text-lg text-gray-800">
                    Attendance for {cutoffLabel}
                </h2>
                <p className="text-sm text-gray-500">
                    Payroll cutoff: {cutoffDate}
                </p>
            </div>

            {loading ? (
                <div className="p-6">
                    <Skeleton lines={6} />
                </div>
            ) : logs.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center">
                    <CalendarX2 className="w-8 h-8 text-gray-400" />
                    <h3 className="mt-3 font-semibold text-gray-700">
                        No attendance for this cutoff
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Use the arrows above to view another cutoff period.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                            <tr>
                                <th className="px-6 py-3 text-left font-medium">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left font-medium">
                                    Time In
                                </th>
                                <th className="px-6 py-3 text-left font-medium">
                                    Time Out
                                </th>
                                <th className="px-6 py-3 text-left font-medium">
                                    Hours
                                </th>
                                <th className="px-6 py-3 text-left font-medium">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {logs.map((log, index) => {
                                const status = statusOf(log);

                                return (
                                    <motion.tr
                                        key={log.date}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: Math.min(index, 10) * 0.04,
                                            duration: 0.25,
                                        }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            {moment(log.date).format("ll")}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            {formatPunch(log.clock_in_at)}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            {formatPunch(log.clock_out_at)}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            {workedHours(log)}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${BADGE_STYLES[status] ?? "bg-gray-100 text-gray-700"}`}
                                            >
                                                {status}
                                            </span>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
