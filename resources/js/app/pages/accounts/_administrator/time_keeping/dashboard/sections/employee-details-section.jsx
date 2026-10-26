import React, { useEffect, useState } from "react";
import moment from "moment";
import {
    User,
    BadgeCheck,
    Building2,
    Briefcase,
    Calendar,
    Clock3,
} from "lucide-react";
import { useSelector } from "react-redux";
import AttendanceHistorySection, { statusOf } from "./attendance-history-section";
import SummaryCardsSection from "./summary-cards-section";
import CutoffSelectorSection from "./cutoff-selector-section";
import {
    get_attendance_for_date_service,
    get_attendance_logs_service,
} from "@/app/services/attendance-service";
import {
    get_cutoff_period,
    get_next_cutoff_period,
    get_previous_cutoff_period,
} from "@/app/lib/cutoff";

const formatScheduleTime = (value) =>
    moment(value, "HH:mm:ss").format("h:mm A");

const formatSchedule = (schedule) => {
    if (!schedule) return "-";
    if (schedule.is_day_off) return "Day Off";

    return `${formatScheduleTime(schedule.time_in)} - ${formatScheduleTime(schedule.time_out)}`;
};

export default function EmployeeDetailsSection() {
    const { data } = useSelector((store) => store.app);
    const [cutoff, setCutoff] = useState(() => get_cutoff_period());
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [schedules, setSchedules] = useState({ today: null, tomorrow: null });
    const [scheduleLoading, setScheduleLoading] = useState(true);

    const today = moment().format("YYYY-MM-DD");
    const tomorrow = moment().add(1, "day").format("YYYY-MM-DD");
    const canGoNext = cutoff.end < today;

    useEffect(() => {
        let cancelled = false;

        const fetchSchedules = async () => {
            setScheduleLoading(true);

            try {
                const [todayRes, tomorrowRes] = await Promise.all([
                    get_attendance_for_date_service(today),
                    get_attendance_for_date_service(tomorrow),
                ]);
                if (!cancelled) {
                    setSchedules({
                        today: todayRes.data.schedule,
                        tomorrow: tomorrowRes.data.schedule,
                    });
                }
            } catch {
                if (!cancelled) setSchedules({ today: null, tomorrow: null });
            } finally {
                if (!cancelled) setScheduleLoading(false);
            }
        };

        fetchSchedules();

        return () => {
            cancelled = true;
        };
    }, [today, tomorrow]);

    useEffect(() => {
        let cancelled = false;

        const fetchLogs = async () => {
            setLoading(true);

            try {
                // Days after today have no attendance yet, so stop the range at today.
                const res = await get_attendance_logs_service({
                    start_date: cutoff.start,
                    end_date: cutoff.end < today ? cutoff.end : today,
                });
                if (!cancelled) setLogs(res.data.data ?? []);
            } catch {
                if (!cancelled) setLogs([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchLogs();

        return () => {
            cancelled = true;
        };
    }, [cutoff.start, cutoff.end, today]);

    const count = (...statuses) =>
        logs.filter((log) => statuses.includes(statusOf(log))).length;

    const summary = [
        {
            title: "Present",
            value: count("Present", "Undertime", "Clocked In", "On Break"),
            color: "bg-green-500",
        },
        { title: "Late", value: count("Late"), color: "bg-yellow-500" },
        { title: "Absent", value: count("Absent"), color: "bg-red-500" },
        { title: "Leave", value: count("On Leave"), color: "bg-blue-500" },
    ];

    return (
        <div className="space-y-6">
            {/* Employee Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="h-10 w-10 text-indigo-600" />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {data?.user?.personal_information?.first_name}{" "}
                                {data?.user?.personal_information?.last_name}
                            </h2>

                            <p className="text-gray-500">
                                Employee ID:{" "}
                                <span className="font-medium">
                                    {data?.user?.account_employee?.employee_id}
                                </span>
                            </p>

                            <div className="flex flex-wrap gap-5 mt-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Building2 size={16} />
                                    {
                                        data?.user?.account_employee?.department
                                            ?.name
                                    }
                                </div>

                                <div className="flex items-center gap-2">
                                    <Briefcase size={16} />
                                    {data?.user?.account_employee?.position}
                                </div>

                            </div>

                            <div className="flex flex-col md:flex-row md:flex-wrap gap-x-6 gap-y-1 mt-2 text-sm text-gray-600">
                                {[
                                    { key: "today", label: "Today", date: today },
                                    { key: "tomorrow", label: "Tomorrow", date: tomorrow },
                                ].map(({ key, label, date }) => (
                                    <div key={key} className="flex items-center gap-2">
                                        <Clock3 size={16} />
                                        <span className="font-medium text-gray-700">
                                            {label} ({moment(date).format("dddd")}):
                                        </span>
                                        {scheduleLoading ? (
                                            <span className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                                        ) : (
                                            formatSchedule(schedules[key])
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium">
                            {/* {data?.user?.personal_information?.status} */}
                            Active
                        </span>
                    </div>
                </div>
            </div>
            <CutoffSelectorSection
                label={cutoff.label}
                cutoffDate={cutoff.cutoffDate}
                disabled={loading}
                canGoNext={canGoNext}
                onPrevious={() => setCutoff(get_previous_cutoff_period(cutoff))}
                onNext={() => setCutoff(get_next_cutoff_period(cutoff))}
            />
            <SummaryCardsSection summary={summary} loading={loading} />
            <AttendanceHistorySection
                logs={logs}
                loading={loading}
                cutoffLabel={cutoff.label}
                cutoffDate={cutoff.cutoffDate}
            />
        </div>
    );
}
