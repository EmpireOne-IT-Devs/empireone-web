import React, { useCallback, useEffect, useState } from "react";
import { Clock, LogIn, LogOut } from "lucide-react";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";
import {
    get_attendance_for_date_service,
    clock_in_service,
    break_start_service,
    break_end_service,
    clock_out_service,
} from "@/app/services/attendance-service";
import AttendanceLogs from "./attendance-logs";

export default function TimekeepingSection() {
    const dispatch = useDispatch();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0],
    );
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchAttendance = useCallback(async (date) => {
        setLoading(true);
        try {
            const res = await get_attendance_for_date_service(date);
            setAttendance(res.data);
        } catch {
            setAttendance(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAttendance(selectedDate);
    }, [selectedDate, fetchAttendance]);

    const status = attendance?.status;

    const canClockIn = !attendance?.clock_in;

    const canBreak =
        attendance?.clock_in &&
        !attendance?.break_start &&
        !attendance?.clock_out;

    const canBackFromBreak =
        attendance?.break_start &&
        !attendance?.break_end &&
        !attendance?.clock_out;

    const canClockOut = attendance?.clock_in && !attendance?.clock_out;

    const handleAction = async (label, service) => {
        setSubmitting(true);

        try {
            const res = await service(selectedDate);

            setAttendance(res.data);

            dispatch(
                setAlert({
                    type: "success",
                    title: `${label} recorded successfully!`,
                }),
            );

            fetchAttendance(selectedDate);
        } catch (err) {
            dispatch(
                setAlert({
                    type: "error",
                    title: err.response?.data?.message,
                }),
            );
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (t) =>
        t ? moment(t, "HH:mm:ss").format("hh:mm A") : "--:--";

    const breakDuration = () => {
        if (!attendance?.break_start || !attendance?.break_end) return "--:--";
        const mins = moment(attendance.break_end, "HH:mm:ss").diff(
            moment(attendance.break_start, "HH:mm:ss"),
            "minutes",
        );
        const h = Math.floor(mins / 60)
            .toString()
            .padStart(2, "0");
        const m = (mins % 60).toString().padStart(2, "0");
        return `${h}:${m}`;
    };

    const statusInfo = (() => {
        if (!attendance)
            return { label: "Ready to Clock In", color: "text-green-600" };
        if (status === "clocked_in")
            return { label: "Currently Working", color: "text-blue-600" };
        if (status === "on_break")
            return { label: "On Break", color: "text-yellow-600" };
        if (status === "clocked_out")
            return { label: "Clocked Out", color: "text-gray-600" };
        return { label: "Unknown", color: "text-gray-400" };
    })();

    return (
        <div className="flex flex-1 gap-6">
            <div className="bg-white w-full rounded-2xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Timekeeping Attendance
                        </h2>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500">
                                Current Time
                            </p>
                            <div>
                                <p className="text-lg font-bold text-gray-600">
                                    {currentTime.toLocaleDateString("en-US", {
                                        weekday: "long",
                                    })}
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {currentTime.toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: true,
                                    })}
                                </p>
                            </div>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) =>
                                    setSelectedDate(e.target.value)
                                }
                                className="border rounded-lg px-2 py-2 mt-1 text-sm"
                            />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                Current Status
                            </p>
                            <p className={`font-semibold ${statusInfo.color}`}>
                                {statusInfo.label}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        disabled={!canClockIn || submitting}
                        onClick={() =>
                            handleAction(
                                "Clock In",
                                clock_in_service(selectedDate),
                            )
                        }
                        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-sm"
                    >
                        <LogIn size={20} />
                        Clock In
                    </button>
                    <button
                        disabled={!canBreak || submitting}
                        onClick={() =>
                            handleAction(
                                "Break",
                                break_start_service(selectedDate),
                            )
                        }
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-sm"
                    >
                        <LogOut size={20} />
                        Break
                    </button>
                    <button
                        disabled={!canBackFromBreak || submitting}
                        onClick={() =>
                            handleAction(
                                "Back from Break",
                                break_end_service(selectedDate),
                            )
                        }
                        className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-sm"
                    >
                        <LogIn size={20} />
                        Back from Break
                    </button>
                    <button
                        disabled={!canClockOut || submitting}
                        onClick={() =>
                            handleAction(
                                "Clock Out",
                                clock_out_service(selectedDate),
                            )
                        }
                        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-sm"
                    >
                        <LogOut size={20} />
                        Clock Out
                    </button>
                </div>

                <div className="mt-6 border-t pt-4">
                    <h3 className="font-semibold text-gray-700 mb-3">
                        Record for {moment(selectedDate).format("MMM D, YYYY")}
                    </h3>
                    {loading ? (
                        <p className="text-sm text-gray-400">Loading...</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">
                                        Break Starts
                                    </p>
                                    <p className="font-bold text-green-700">
                                        {formatTime(attendance?.break_start)}
                                    </p>
                                </div>
                                <div className="bg-red-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">
                                        Break Ends
                                    </p>
                                    <p className="font-bold text-red-700">
                                        {formatTime(attendance?.break_end)}
                                    </p>
                                </div>
                                <div className="bg-orange-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">
                                        Duration
                                    </p>
                                    <p className="font-bold text-orange-700">
                                        {breakDuration()}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-5">
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">
                                        Clock In
                                    </p>
                                    <p className="font-bold text-green-700">
                                        {formatTime(attendance?.clock_in)}
                                    </p>
                                </div>
                                <div className="bg-red-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">
                                        Clock Out
                                    </p>
                                    <p className="font-bold text-red-700">
                                        {formatTime(attendance?.clock_out)}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">
                                        Time In
                                    </p>
                                    <p className="font-bold text-green-700">
                                        8:00 AM
                                    </p>
                                </div>
                                <div className="bg-red-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">
                                        Time Out
                                    </p>
                                    <p className="font-bold text-red-700">
                                        5:00 PM
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <AttendanceLogs />
        </div>
    );
}
