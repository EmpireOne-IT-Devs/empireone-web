import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import {
    FiCalendar as CalendarX2,
} from "react-icons/fi";
import Skeleton from "@/app/_components/skeleton";
import { get_attendance_logs_service } from "@/app/services/attendance-service";
import FilterLogDate from "./filter-log-date";

const formatPunch = (value) => (value ? moment(value).format("hh:mm A") : "-");

const hoursWorked = (log) => {
    if (!log.clock_in_at || !log.clock_out_at) return 0;
    const minutes =
        moment(log.clock_out_at).diff(moment(log.clock_in_at), "minutes") -
        (log.breaktime_minutes ?? 0);
    return Math.max(0, minutes) / 60;
};

export default function TimeSheetSection() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [endDate, setEndDate] = useState("");
    const [startDate, setStartDate] = useState(
        moment().subtract(19, "days").format("YYYY-MM-DD"),
    );

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const res = await get_attendance_logs_service({
                    start_date: startDate,
                    ...(endDate ? { end_date: endDate } : {}),
                });
                setLogs(res.data.data ?? []);
            } catch {
                setLogs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [startDate, endDate]);

    const totals = useMemo(
        () => ({
            hours: logs.reduce((sum, log) => sum + hoursWorked(log), 0),
            late: logs.reduce((sum, log) => sum + (log.late_minutes ?? 0), 0),
            undertime: logs.reduce((sum, log) => sum + (log.undertime_minutes ?? 0), 0),
            days: logs.filter((log) => log.clock_in_at).length,
        }),
        [logs],
    );

    const summary = [
        { title: "Days Worked", value: totals.days },
        { title: "Total Hours", value: totals.hours.toFixed(2) },
        { title: "Late (mins)", value: totals.late },
        { title: "Undertime (mins)", value: totals.undertime },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Time Sheets</h1>
                <p className="text-sm text-gray-500">Your attendance record for the selected period.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {summary.map((item) => (
                    <div
                        key={item.title}
                        className="bg-white border border-gray-200 rounded-xl shadow-sm p-5"
                    >
                        <p className="text-sm text-gray-500">{item.title}</p>
                        <h3 className="text-2xl font-bold mt-1 text-gray-800">
                            {loading ? "-" : item.value}
                        </h3>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-w-0">
                <FilterLogDate
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={setStartDate}
                    onEndDateChange={setEndDate}
                />

                {loading ? (
                    <Skeleton lines={6} />
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center py-12 text-center">
                        <CalendarX2 className="w-8 h-8 text-gray-400" />
                        <h4 className="mt-3 font-semibold text-gray-700">No records found</h4>
                        <p className="mt-1 text-sm text-gray-500">
                            Try a different date range.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 text-left font-medium">Date</th>
                                    <th className="px-4 py-3 text-left font-medium">In</th>
                                    <th className="px-4 py-3 text-left font-medium">Break Out</th>
                                    <th className="px-4 py-3 text-left font-medium">Break In</th>
                                    <th className="px-4 py-3 text-left font-medium">Out</th>
                                    <th className="px-4 py-3 text-left font-medium">Hours</th>
                                    <th className="px-4 py-3 text-left font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {logs.map((log) => (
                                    <tr key={log.date} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {moment(log.date).format("LL")}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">{formatPunch(log.clock_in_at)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{formatPunch(log.break_start_at)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{formatPunch(log.break_end_at)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{formatPunch(log.clock_out_at)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{hoursWorked(log).toFixed(2)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {log.display_status || log.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
