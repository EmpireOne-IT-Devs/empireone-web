import moment from "moment";
import React, { useEffect, useState } from "react";
import { get_attendance_logs_service } from "@/app/services/attendance-service";
import FilterLogDate from "./filter-log-date";
import TableColumnsComponent from "../component/table-columns-component";

export default function AttendanceLogs({ refreshKey }) {
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
    }, [refreshKey, startDate, endDate]);

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

            case "Day Off":
                return (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                        Day Off
                    </span>
                );

            case "Absent":
                return (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                        Absent
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

    const formatTime = (time) =>
        time ? moment(time, "HH:mm:ss").format("hh:mm A") : "-";

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 min-w-0 w-full shrink-0">
            <div className="flex justify-between mb-2">
                <h3 className="font-semibold text-gray-700">Attendance Logs</h3>
            </div>

            <FilterLogDate
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
            />

            {/* ONLY THIS AREA SCROLLS HORIZONTALLY AND VERTICALLY */}
            <div className="relative w-full max-w-full max-h-[500px] overflow-x-auto overflow-y-auto">
                <table className="w-max min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-30">
                        <tr>
                            {/* Sticky Date Header */}
                            <th
                                className="
                            sticky left-0 z-20
                            bg-gray-50
                            px-4 py-3
                            text-left
                            text-xs
                            font-medium
                            text-gray-500
                            uppercase
                            whitespace-nowrap
                            min-w-[150px]
                            border-r
                            border-gray-200
                        "
                            >
                                Date
                            </th>

                            <TableColumnsComponent column_name="Clock In" />
                            <TableColumnsComponent column_name="Clock In Correction" />
                            <TableColumnsComponent column_name="Clock Out" />
                            <TableColumnsComponent column_name="Clock Out Correction" />
                            <TableColumnsComponent column_name="Status" />
                            <TableColumnsComponent column_name="Late (mins)" />
                            <TableColumnsComponent column_name="Undertime (mins)" />
                            <TableColumnsComponent column_name="Breaktime (mins)" />
                            <TableColumnsComponent column_name="Breaktime Limit" />
                            <TableColumnsComponent column_name="Regular Overtime" />
                            <TableColumnsComponent column_name="Dayoff Overtime In minute" />
                            <TableColumnsComponent column_name="Dayoff Overtime Beyond 8hrs (mins)" />
                            <TableColumnsComponent column_name="Dayoff Overtime on Regular Holiday (mins)" />
                            <TableColumnsComponent column_name="Dayoff Overtime on Special Holiday (mins)" />
                            <TableColumnsComponent column_name="Regular Holiday Overtime (mins)" />
                            <TableColumnsComponent column_name="Special Holiday Overtime (mins)" />
                            <TableColumnsComponent column_name="Regular Holiday (mins)" />
                            <TableColumnsComponent column_name="Special Holiday (mins)" />
                            <TableColumnsComponent column_name="Night Diff" />
                            <TableColumnsComponent column_name="Regular Holiday Night Diff" />
                            <TableColumnsComponent column_name="Special Holiday Night Diff" />
                            <TableColumnsComponent column_name="Overtime Night Diff (mins)" />
                            <TableColumnsComponent column_name="DayOff Overtime Night Diff (mins)" />
                            <TableColumnsComponent column_name="Minutes Required Present" />
                            <TableColumnsComponent column_name="Is DayOff" />
                            <TableColumnsComponent column_name="Is OnLeave" />
                            <TableColumnsComponent column_name="Is Voluntary Time Off" />
                            <TableColumnsComponent column_name="Date Correction Endorsed" />
                            <TableColumnsComponent column_name="Date Correction Granted" />
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={30}
                                    className="px-4 py-6 text-center text-sm text-gray-400"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : logs.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={30}
                                    className="px-4 py-6 text-center text-sm text-gray-400"
                                >
                                    No attendance records found.
                                </td>
                            </tr>
                        ) : (
                            logs.map((log, index) => (
                                <tr key={index}>
                                    {/* Sticky Date */}
                                    <td
                                        className="
                                    sticky left-0 z-10
                                    bg-white
                                    px-4 py-3
                                    whitespace-nowrap
                                    min-w-[150px]
                                    border-r
                                    border-gray-200
                                "
                                    >
                                        {moment(log.date).format("LL")}
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {formatTime(log.clock_in)}
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {formatTime(log.clock_in_correction)}
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {formatTime(log.clock_out)}
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {formatTime(log.clock_out_correction)}
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {getStatusBadge(log)}
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {log.late_minutes ?? 0}
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {log.undertime_minutes ?? 0}
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {log.breaktime_minutes ?? 0}
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {log.breaktime_limit ?? 0}
                                    </td>

                                    {/* Continue your other columns here */}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
