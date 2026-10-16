import React, { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { Building2, Briefcase, User, CalendarX2 } from "lucide-react";
import Skeleton from "@/app/_components/skeleton";
import { get_attendance_logs_service } from "@/app/services/attendance-service";

const statusOf = (log) => log.display_status || log.status;

const statusBadge = (status) => {
    const styles = {
        Present: "bg-green-100 text-green-700",
        Late: "bg-yellow-100 text-yellow-700",
        Undertime: "bg-orange-100 text-orange-700",
        "Clocked In": "bg-blue-100 text-blue-700",
        "On Break": "bg-yellow-100 text-yellow-700",
        "Day Off": "bg-purple-100 text-purple-700",
        "On Leave": "bg-teal-100 text-teal-700",
        Absent: "bg-red-100 text-red-700",
    };
    return styles[status] ?? "bg-gray-100 text-gray-700";
};

const formatPunch = (value) => (value ? moment(value).format("hh:mm A") : "-");

export default function DashboardSection() {
    const { data } = useSelector((store) => store.app);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await get_attendance_logs_service({
                    start_date: moment().subtract(19, "days").format("YYYY-MM-DD"),
                });
                setLogs(res.data.data ?? []);
            } catch {
                setLogs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const count = (...statuses) =>
        logs.filter((log) => statuses.includes(statusOf(log))).length;

    const summary = [
        { title: "Present", value: count("Present", "Clocked In", "On Break"), color: "bg-green-500" },
        { title: "Late", value: count("Late"), color: "bg-yellow-500" },
        { title: "Absent", value: count("Absent"), color: "bg-red-500" },
        { title: "Leave", value: count("On Leave"), color: "bg-blue-500" },
    ];

    const recent = logs.slice(0, 5);
    const employee = data?.user?.account_employee;
    const personal = data?.user?.personal_information;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-5">
                    <div className="h-16 w-16 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-xl font-bold text-gray-800 truncate">
                            {personal?.first_name} {personal?.last_name}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Employee ID:{" "}
                            <span className="font-medium">{employee?.employee_id}</span>
                        </p>
                        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-2">
                                <Building2 size={16} />
                                {employee?.department?.name}
                            </span>
                            <span className="flex items-center gap-2">
                                <Briefcase size={16} />
                                {employee?.position}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <p className="mb-2 text-sm text-gray-500">Last 20 days</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {summary.map((item) => (
                        <div
                            key={item.title}
                            className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex items-center justify-between"
                        >
                            <div>
                                <p className="text-sm text-gray-500">{item.title}</p>
                                <h3 className="text-3xl font-bold mt-1 text-gray-800">
                                    {loading ? "-" : item.value}
                                </h3>
                            </div>
                            <div className={`w-3 h-12 rounded-full ${item.color}`} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Recent Attendance</h3>
                    <p className="text-sm text-gray-500">Your latest five days</p>
                </div>

                {loading ? (
                    <div className="p-6">
                        <Skeleton lines={5} />
                    </div>
                ) : recent.length === 0 ? (
                    <div className="flex flex-col items-center py-12 text-center">
                        <CalendarX2 className="w-8 h-8 text-gray-400" />
                        <h4 className="mt-3 font-semibold text-gray-700">No attendance yet</h4>
                        <p className="mt-1 text-sm text-gray-500">
                            Clock in from the Attendance tab to start your record.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium">Date</th>
                                    <th className="px-6 py-3 text-left font-medium">Clock In</th>
                                    <th className="px-6 py-3 text-left font-medium">Clock Out</th>
                                    <th className="px-6 py-3 text-left font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recent.map((log) => (
                                    <tr key={log.date} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            {moment(log.date).format("LL")}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            {formatPunch(log.clock_in_at)}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            {formatPunch(log.clock_out_at)}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${statusBadge(statusOf(log))}`}
                                            >
                                                {statusOf(log)}
                                            </span>
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
