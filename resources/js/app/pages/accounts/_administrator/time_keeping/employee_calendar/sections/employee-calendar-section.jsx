import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";
import moment from "moment";
import { get_attendance_logs_service } from "@/app/services/attendance-service";

const formatTime = (timeString) => {
    if (!timeString) return "--:--";
    const [hourString, minute] = timeString.split(":");
    const hour = parseInt(hourString, 10);
    if (Number.isNaN(hour)) return "--:--";
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour.toString().padStart(2, "0")}:${minute} ${ampm}`;
};

const formatDate = (date) => {
    if (!date) return "";
    return moment(date).format("MMMM DD, YYYY");
};

const getColorByStatus = (status) => {
    switch (status?.toLowerCase()) {
        case "present":
            return "bg-teal-600 text-white border-teal-700";
        case "late":
            return "bg-blue-500 text-white border-blue-600";
        case "undertime":
            return "bg-orange-500 text-white border-orange-600";
        case "clocked in":
            return "bg-green-500 text-white border-green-600";
        case "on break":
            return "bg-amber-500 text-white border-amber-600";
        case "day off":
            return "bg-emerald-600 text-white border-emerald-700";
        case "absent":
            return "bg-red-600 text-white border-red-700";
        default:
            return "bg-gray-500 text-white border-gray-600";
    }
};

// Solid tile background reflecting the legend colors, based on the day's primary attendance status.
const getTileColorByStatus = (status) => {
    switch (status?.toLowerCase()) {
        case "present":
            return "bg-teal-600 hover:bg-teal-700 text-white";
        case "late":
            return "bg-blue-500 hover:bg-blue-600 text-white";
        case "clocked in":
            return "bg-green-500 hover:bg-green-600 text-white";
        case "on break":
            return "bg-amber-500 hover:bg-amber-600 text-white";
        case "undertime":
            return "bg-orange-500 hover:bg-orange-600 text-white";
        case "day off":
            return "bg-emerald-600 hover:bg-emerald-700 text-white";
        case "leave":
            return "bg-purple-500 hover:bg-purple-600 text-white";
        case "voluntary time-off":
            return "bg-yellow-500 hover:bg-yellow-600 text-gray-900";
        case "absent":
            return "bg-red-600 hover:bg-red-700 text-white";
        default:
            return "bg-gray-50/40 hover:bg-gray-100/60 text-gray-400";
    }
};

export default function EmployeeCalendarSection() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isDraggingOverDate, setIsDraggingOverDate] = useState(null);

    const dispatch = useDispatch();

    const [logs, setLogs] = useState([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(false);

    // --- State for Post-Drop Time Editing Modal ---
    const [timeEditTarget, setTimeEditTarget] = useState(null);
    const [startTimeInput, setStartTimeInput] = useState("09:00");
    const [endTimeInput, setEndTimeInput] = useState("10:00");
    const [isSavingTime, setIsSavingTime] = useState(false);
    const [holidays, setHolidays] = useState([]);

    const today = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    useEffect(() => {
        const startDate = moment([currentYear, currentMonth]).startOf("month").format("YYYY-MM-DD");
        const endDate = moment([currentYear, currentMonth]).endOf("month").format("YYYY-MM-DD");

        const fetchLogs = async () => {
            setIsLoadingLogs(true);
            try {
                const response = await get_attendance_logs_service({
                    start_date: startDate,
                    end_date: endDate,
                });
                setLogs(response?.data?.data ?? []);
            } catch (error) {
                console.error("Failed to fetch attendance logs:", error);
                setLogs([]);
            } finally {
                setIsLoadingLogs(false);
            }
        };

        fetchLogs();
    }, [currentYear, currentMonth]);

    const resolveDisplayStatus = (log) => {
        // Lateness must show as "Late" even while still clocked in / on break, not just after clock-out.
        if (log.status === "clocked_in") {
            return log.late_minutes > 0 ? "Late" : "Present";
        }

        if (log.status === "on_break") {
            return log.late_minutes > 0 ? "Late" : "On Break";
        }

        if (log.status === "clocked_out") {
            if (log.late_minutes > 0) return "Late";
            if (log.undertime_minutes > 0) return "Undertime";
            return "Present";
        }

        return log.display_status || log.status;
    };

    const calendarSchedules = logs.map((log) => {
        const status = resolveDisplayStatus(log);

        return {
            id: log.id ?? `${log.user_id}-${log.date}`,
            title: log.holiday_name || status,
            dateString: moment(log.date).format("YYYY-MM-DD"),

            scheduleTimeIn: log.schedule_time_in,
            scheduleTimeOut: log.schedule_time_out,
            clockInTime: log.clock_in_time,
            clockInDate: log.clock_in_date,
            breakStartTime: log.break_start_time,
            breakEndTime: log.break_end_time,
            clockOutTime: log.clock_out_time,
            clockOutDate: log.clock_out_date,

            lateMinutes: log.late_minutes ?? 0,
            undertimeMinutes: log.undertime_minutes ?? 0,
            breaktimeMinutes: log.breaktime_minutes ?? 0,
            overbreakMinutes: log.overbreak_minutes ?? 0,
            requiredMinutes: log.required_minutes ?? 0,
            isDayOff: !!log.is_day_off,

            holidayName: log.holiday_name,
            isRegularHoliday: !!log.is_regular_holiday,
            isSpecialHoliday: !!log.is_special_holiday,

            color: getColorByStatus(status),
            status,
        };
    });

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getDaysInMonth = (year, month) =>
        new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) =>
        new Date(year, month, 1).getDay();

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const handlePrevMonth = () =>
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    const handleNextMonth = () =>
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    const handleToday = () => {
        const d = new Date();
        setCurrentDate(d);
        setSelectedDate(d);
    };

    // --- Drag and Drop Handlers ---
    const handleDragStart = (e, schedule) => {
        e.dataTransfer.setData("text/plain", schedule.id);
        e.dataTransfer.setData(
            "start_time",
            schedule.scheduleTimeIn || "09:00",
        );
        e.dataTransfer.setData("end_time", schedule.scheduleTimeOut || "10:00");
        e.dataTransfer.setData("title", schedule.title);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, dateStr) => {
        e.preventDefault();
        if (isDraggingOverDate !== dateStr) {
            setIsDraggingOverDate(dateStr);
        }
    };

    const handleDragLeave = () => {
        setIsDraggingOverDate(null);
    };

    const handleDrop = (e, targetDate) => {
        e.preventDefault();
        setIsDraggingOverDate(null);

        const scheduleId = e.dataTransfer.getData("text/plain");
        const startTime = e.dataTransfer.getData("start_time");
        const endTime = e.dataTransfer.getData("end_time");
        const title = e.dataTransfer.getData("title");

        if (scheduleId) {
            setStartTimeInput(startTime);
            setEndTimeInput(endTime);
            setTimeEditTarget({
                id: scheduleId,
                dateObj: targetDate,
                label: title,
            });
        }
    };

    const handleConfirmScheduleChange = async () => {
        if (!timeEditTarget) return;
        setIsSavingTime(true);

        const { id, dateObj } = timeEditTarget;
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;

        try {
            dispatch(
                setAlert({
                    type: "success",
                    title: "Schedule Updated Successfully!",
                    message:
                        "The schedule has been updated and is ready for review.",
                    open: true,
                }),
            );
            setTimeEditTarget(null);
        } catch (error) {
            console.error("Failed to update schedule: ", error);
        } finally {
            setIsSavingTime(false);
        }
    };

    const blanks = Array.from({ length: firstDay }, (_, i) => (
        <div
            key={`blank-${i}`}
            className="min-h-[140px] bg-gray-50/40 border-r border-b border-gray-100"
        />
    ));

    const days = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dateObj = new Date(currentYear, currentMonth, day);
        const formattedCellDate = moment(dateObj).format("YYYY-MM-DD");
        const dateString = dateObj.toDateString();

        const isToday =
            dateObj.getDate() === today.getDate() &&
            dateObj.getMonth() === today.getMonth() &&
            dateObj.getFullYear() === today.getFullYear();

        const isSelected =
            dateObj.getDate() === selectedDate.getDate() &&
            dateObj.getMonth() === selectedDate.getMonth() &&
            dateObj.getFullYear() === selectedDate.getFullYear();

        const isHoveredDropTarget = isDraggingOverDate === dateString;

        const daySchedules = calendarSchedules.filter(
            (s) => s.dateString === formattedCellDate,
        );

        const dayHolidays = holidays.filter(
            (h) => h.date === formattedCellDate,
        );

        const tileStatus = daySchedules[0]?.status;
        // Future dates have no real attendance yet, so keep them neutral instead of coloring as Absent.
        const isFutureDate = dateObj > today;
        const tileColor = isFutureDate
            ? "bg-gray-200 hover:bg-gray-100/60 text-white"
            : getTileColorByStatus(tileStatus);

        return (
            <div
                key={`day-${day}`}
                onClick={() => setSelectedDate(dateObj)}
                onDragOver={(e) => handleDragOver(e, dateString)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, dateObj)}
                className={`px-1.5 py-1 border-r border-b border-gray-200 transition-all flex flex-col gap-1 min-h-[140px] cursor-pointer relative group overflow-hidden ${tileColor}
                ${isSelected ? "ring-2 ring-inset ring-blue-400 z-10" : ""}
                ${isHoveredDropTarget ? "ring-2 ring-dashed ring-blue-400 z-20 scale-[0.98]" : ""}
            `}
            >
                <div className="flex justify-end items-start p-1">
                    <span
                        className={`text-xs font-bold px-1.5 py-0.5 rounded transition-colors text-white
                            ${isToday ? "bg-blue-600 shadow-md" : "bg-black/20"}
                        `}
                    >
                        {day}
                    </span>
                    {daySchedules.length > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                </div>
                <div className="flex flex-col gap-1.5 mt-1 flex-1 overflow-y-auto max-h-[260px] pr-0.5 custom-scrollbar text-[11px]">
                    {isLoadingLogs && daySchedules.length === 0 && (
                        <span className="opacity-60 italic">Loading...</span>
                    )}

                    {daySchedules.map((schedule) => (
                        <div
                            key={schedule.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, schedule)}
                            className="rounded-md border border-white/30 bg-black/15 px-1.5 py-1 flex flex-col gap-0.5 cursor-grab"
                        >
                            <div className="flex items-center justify-between gap-1">
                                <span className="font-bold truncate">
                                    {schedule.status}
                                </span>
                                <span className="text-[10px] font-semibold">
                                    Late {schedule.lateMinutes > 0 ? `${schedule.lateMinutes}m` : "--"}
                                </span>
                            </div>

                            <div className="truncate">
                                <strong>Holiday:</strong>{" "}
                                {schedule.holidayName || "--"}
                            </div>

                            <div>
                                <strong>Schedule:</strong>{" "}
                                {formatTime(schedule.scheduleTimeIn)} -{" "}
                                {formatTime(schedule.scheduleTimeOut)}
                            </div>

                            <div>
                                <strong>Time In:</strong>{" "}
                                {formatTime(schedule.clockInTime)}
                                {" "}
                                ({schedule.clockInDate
                                    ? formatDate(schedule.clockInDate)
                                    : "--"})
                            </div>

                            <div>
                                <strong>Time Out:</strong>{" "}
                                {formatTime(schedule.clockOutTime)}
                                {" "}
                                ({schedule.clockOutDate
                                    ? formatDate(schedule.clockOutDate)
                                    : "--"})
                            </div>

                            <div>
                                <strong>Break:</strong>{" "}
                                {formatTime(schedule.breakStartTime)} -{" "}
                                {formatTime(schedule.breakEndTime)}
                            </div>

                            <div>
                                <strong>Undertime:</strong>{" "}
                                {schedule.undertimeMinutes > 0
                                    ? `${schedule.undertimeMinutes}m`
                                    : "--"}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    });

    return (
        <div className="flex-1 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col relative">
            {/* Header */}
            <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-white to-gray-50/50">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Employee Calendar
                    </h1>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <span className="bg-red-600 text-white text-[10px] font-bold p-1 rounded">
                            ABSENT
                        </span>
                        <span className="bg-emerald-600 text-white text-[10px] font-bold p-1 rounded">
                            DAYOFF
                        </span>
                        <span className="bg-yellow-500 text-gray-900 text-[10px] font-bold p-1 rounded">
                            VOLUNTARY TIME-OFF
                        </span>
                        <span className="bg-blue-500 text-white text-[10px] font-bold p-1 rounded">
                            LATE
                        </span>
                        <span className="bg-purple-500 text-white text-[10px] font-bold p-1 rounded">
                            LEAVE
                        </span>
                        <span className="bg-teal-600 text-white text-[10px] font-bold p-1 rounded">
                            PRESENT
                        </span>
                        <span className="bg-orange-500 text-white text-[10px] font-bold p-1 rounded">
                            ISSUE IN MINUTES REQUIRED PRESENT
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-inner border border-gray-100">
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all"
                    >
                        &lt;
                    </button>
                    <button
                        onClick={handleToday}
                        className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-blue-600 min-w-[140px] rounded-lg hover:bg-gray-50 transition-all text-center"
                    >
                        {currentDate.toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                        })}
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all"
                    >
                        &gt;
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="p-4 bg-white">
                <div className="grid grid-cols-7 mb-2">
                    {daysOfWeek.map((day) => (
                        <div
                            key={day}
                            className="text-[11px] font-black text-gray-400 uppercase tracking-widest text-center py-2"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 border-t border-l border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    {blanks}
                    {days}
                    {Array.from({
                        length: (7 - ((firstDay + daysInMonth) % 7)) % 7,
                    }).map((_, i) => (
                        <div
                            key={`trail-${i}`}
                            className="min-h-[140px] bg-gray-50/40 border-r border-b border-gray-200"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
