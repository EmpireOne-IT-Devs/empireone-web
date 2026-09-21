import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "@/app/store/store";
import { setAlert } from "@/app/redux/app-slice";
import moment from "moment";
import { get_attendance_logs_service } from "@/app/services/attendance-service";

const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hourString, minute] = timeString.split(":");
    const hour = parseInt(hourString, 10);
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
        case "scheduled":
            return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500";
        case "pending":
            return "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500";
        case "cancelled":
            return "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500";
        case "present":
            return "bg-emerald-800 text-white border-emerald-900";
        case "absent":
            return "bg-rose-800 text-white border-rose-900";
        default:
            return "bg-emerald-800 text-white border-emerald-900";
    }
};

export default function EmployeeCalendarSection() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isDraggingOverDate, setIsDraggingOverDate] = useState(null);

    // --- 1. Declare dispatch and useSelector at the very top ---
    const dispatch = useDispatch();

    const schedules = useSelector(
        (state) =>
            state.attendance?.attendanceLogs ||
            state.attendance?.schedules ||
            state.employeeCalendar?.schedules ||
            [],
    );

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                // 1. Call your async service function
                const response = await get_attendance_logs_service();

                // 2. Dispatch the action with your fetched payload
                // (Adjust 'setAttendanceLogs' to match the actual action creator exported from your slice)
                // dispatch(setAttendanceLogs(response?.data || response));
            } catch (error) {
                console.error("Failed to fetch attendance logs:", error);
            }
        };

        fetchLogs();
    }, [dispatch, currentDate]);

    // --- State for Post-Drop Time Editing Modal ---
    const [timeEditTarget, setTimeEditTarget] = useState(null);
    const [startTimeInput, setStartTimeInput] = useState("09:00");
    const [endTimeInput, setEndTimeInput] = useState("10:00");
    const [isSavingTime, setIsSavingTime] = useState(false);
    const [holidays, setHolidays] = useState([]);

    const today = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const calendarSchedules = schedules.map((sched) => {
        // Map your log fields (using cin_date or scheduled_date as fallback)
        const dateSource =
            sched.cin_date || sched.scheduled_date || sched.created_at;
        const schedMoment = moment(dateSource);
        const formattedSchedDate = schedMoment.isValid()
            ? schedMoment.format("YYYY-MM-DD")
            : "";

        const firstName =
            sched?.application?.applicant?.personal_information?.first_name ||
            sched?.first_name ||
            "";
        const lastName =
            sched?.application?.applicant?.personal_information?.last_name ||
            sched?.last_name ||
            "";

        const fullName = `${firstName} ${lastName}`.trim();

        return {
            id: sched.id,
            title: fullName || sched.title || "Attendance Log",
            dateString: formattedSchedDate,

            // Schedule times & metrics mapping to match your logs format
            tin: sched.start_time || sched.tin,
            tinC: sched.tin_c || "",
            cinDate: sched.cin_date || "sss",
            cinTime: sched.cin_time || "",
            cinCDate: sched.cinc_date || "",
            cinCTime: sched.cinc_time || "",

            tout: sched.end_time || sched.tout,
            toutC: sched.tout_c || "",
            coutDate: sched.cout_date || "",
            coutTime: sched.cout_time || "",
            coutCDate: sched.coutc_date || "",
            coutCTime: sched.coutc_time || "",

            nightDiff: sched.night_diff ?? 0,
            regularHolidayNightDiff: sched.regular_holiday_night_diff ?? 0,
            specialHolidayNightDiff: sched.special_holiday_night_diff ?? 0,
            overtimeNightDiff: sched.overtime_night_diff ?? 0,
            dayOffOvertimeNightDiff: sched.dayoff_overtime_night_diff ?? 0,
            minutesRequiredPresent: sched.minutes_required_present ?? 480,

            color: getColorByStatus(sched.status),
            status: sched.status,
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
            schedule.raw_start_time || "09:00",
        );
        e.dataTransfer.setData("end_time", schedule.raw_end_time || "10:00");
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

        return (
            <div
                key={`day-${day}`}
                onClick={() => setSelectedDate(dateObj)}
                onDragOver={(e) => handleDragOver(e, dateString)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, dateObj)}
                className={`px-1.5 py-1 border-r border-b text-white border-gray-200 transition-all flex flex-col gap-1 min-h-[140px] cursor-pointer relative group overflow-hidden
                ${isSelected ? "bg-emerald-600 ring-1 ring-inset ring-blue-200 z-10" : dayHolidays.length > 0 ? "bg-rose-50/60 hover:bg-rose-50" : "bg-emerald-900/90 hover:bg-emerald-900"}
                ${isHoveredDropTarget ? "bg-blue-100/60 ring-2 ring-dashed ring-blue-400 z-20 scale-[0.98]" : ""}
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
                <div className="flex flex-col gap-1 mt-1 flex-1 overflow-y-auto max-h-[260px] pr-0.5 custom-scrollbar text-xs">
                    <div className="font-bold mb-1">
                        {/* {schedule.title} */}
                    </div>

                    <div>
                        <strong>TIn:</strong>
                        {/* {formatTime(schedule.tin)} */}
                    </div>

                    <div>
                        <strong>TInC:</strong>
                        {/* {schedule.tinC || ""} */}
                    </div>

                    <div>
                        <strong>CIn Date:</strong>{" "}
                        {/* {formatDate(schedule.cinDate)} */}
                    </div>

                    <div>
                        <strong>CIn Time:</strong>{" "}
                        {/* {formatTime(schedule.cinTime)} */}
                    </div>

                    <div>
                        <strong>CInC Date:</strong>{" "}
                        {/* {formatDate(schedule.cinCDate)} */}
                    </div>

                    <div>
                        <strong>CInC Time:</strong>{" "}
                        {/* {formatTime(schedule.cinCTime)} */}
                    </div>

                    <div className="mt-1">
                        <strong>TOut:</strong>{" "}
                        {/* {formatTime(schedule.tout)} */}
                    </div>

                    <div>
                        <strong>TOutC:</strong> {/* {schedule.toutC || ""} */}
                    </div>

                    <div>
                        <strong>COut Date:</strong>{" "}
                        {/* {formatDate(schedule.coutDate)} */}
                    </div>

                    <div>
                        <strong>COut Time:</strong>{" "}
                        {/* {formatTime(schedule.coutTime)} */}
                    </div>

                    <div>
                        <strong>COutC Date:</strong>{" "}
                        {/* {formatDate(schedule.coutCDate)} */}
                    </div>

                    <div>
                        <strong>COutC Time:</strong>{" "}
                        {/* {formatTime(schedule.coutCTime)} */}
                    </div>

                    <div>
                        <strong>Night Diff:</strong>{" "}
                        {/* {schedule.nightDiff} */}
                    </div>

                    <div>
                        <strong>Regular Holiday Night Diff:</strong>{" "}
                        {/* {schedule.regularHolidayNightDiff} */}
                    </div>

                    <div>
                        <strong>Special Holiday Night Diff:</strong>{" "}
                        {/* {schedule.specialHolidayNightDiff} */}
                    </div>

                    <div>
                        <strong>Overtime Night Diff:</strong>{" "}
                        {/* {schedule.overtimeNightDiff} */}
                    </div>

                    <div>
                        <strong>DayOff Overtime Night Diff:</strong>{" "}
                        {/* {schedule.dayOffOvertimeNightDiff} */}
                    </div>

                    <div>
                        <strong>Minutes Required Present:</strong>{" "}
                        {/* {schedule.minutesRequiredPresent} */}
                    </div>
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
