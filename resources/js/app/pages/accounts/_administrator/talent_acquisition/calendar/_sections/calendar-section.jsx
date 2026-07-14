import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SelectedDateSection from "./selected-date-section";
import { change_job_applicant_schedule_service } from "@/app/services/job-applicant-schedule-service";
import store from "@/app/store/store";
import { get_job_applicant_schedule_thunk } from "@/app/redux/talent-acquisition-thunk";
import { setAlert } from "@/app/redux/app-slice";

const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hourString, minute] = timeString.split(":");
    const hour = parseInt(hourString, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour.toString().padStart(2, "0")}:${minute} ${ampm}`;
};

const getColorByStatus = (status) => {
    switch (status?.toLowerCase()) {
        case "scheduled":
            return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500";
        case "pending":
            return "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500";
        case "cancelled":
            return "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500";
        default:
            return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500";
    }
};

export default function CalendarSection() {
    const { schedules } = useSelector((store) => store.talent_acquisitions);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isDraggingOverDate, setIsDraggingOverDate] = useState(null);
    const dispatch = useDispatch()
    // --- State for Post-Drop Time Editing Modal ---
    const [timeEditTarget, setTimeEditTarget] = useState(null); // { id, dateObj, label }
    const [startTimeInput, setStartTimeInput] = useState("09:00");
    const [endTimeInput, setEndTimeInput] = useState("10:00");
    const [isSavingTime, setIsSavingTime] = useState(false);

    const today = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const calendarSchedules = (schedules || []).map((sched) => {
        const [year, month, day] = sched.scheduled_date.split("-");
        return {
            id: sched.id,
            title: `${sched?.application?.applicant?.personal_information?.first_name} ${sched?.application?.applicant?.personal_information?.last_name}`,
            date: new Date(year, month - 1, day),
            raw_start_time: sched.start_time,
            raw_end_time: sched.end_time,
            time: `${formatTime(sched.start_time)} - ${formatTime(sched.end_time)}`,
            color: getColorByStatus(sched.status),
            status: sched.status,
            interviewer: sched?.interviewer?.name,
            meeting_link: sched?.meeting_link,
        };
    });

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    const handleToday = () => {
        const d = new Date();
        setCurrentDate(d);
        setSelectedDate(d);
    };

    // --- Drag and Drop Handlers ---
    const handleDragStart = (e, schedule) => {
        e.dataTransfer.setData("text/plain", schedule.id);
        // Stash original times so we can pre-populate the edit fields
        e.dataTransfer.setData("start_time", schedule.raw_start_time || "09:00");
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
            // Open time configuration modal
            setTimeEditTarget({
                id: scheduleId,
                dateObj: targetDate,
                label: title
            });
        }
    };

    const handleConfirmScheduleChange = async () => {
        if (!timeEditTarget) return;
        setIsSavingTime(true);

        const { id, dateObj } = timeEditTarget;
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        try {
            await change_job_applicant_schedule_service({
                id: id,
                scheduled_date: formattedDate,
                start_time: startTimeInput,
                end_time: endTimeInput
            });
            await store.dispatch(get_job_applicant_schedule_thunk());
            setTimeEditTarget(null);
            dispatch(
                setAlert({
                    type: "success",
                    title: "Schdule Updated Successfully!",
                    message:
                        "The schedule has been updated and is ready for review.",
                    open: true,
                }),
            );
        } catch (error) {
            console.error("Failed to update schedule: ", error);
        } finally {
            setIsSavingTime(false);
        }
    };

    const blanks = Array.from({ length: firstDay }, (_, i) => (
        <div key={`blank-${i}`} className="min-h-[110px] bg-gray-50/40 border-r border-b border-gray-100" />
    ));

    const days = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dateObj = new Date(currentYear, currentMonth, day);
        const dateString = dateObj.toDateString();

        const daySchedules = calendarSchedules.filter(
            (s) =>
                s.date.getDate() === day &&
                s.date.getMonth() === currentMonth &&
                s.date.getFullYear() === currentYear,
        );

        const isToday = today.toDateString() === dateString;
        const isSelected = selectedDate.toDateString() === dateString;
        const isHoveredDropTarget = isDraggingOverDate === dateString;

        return (
            <SelectedDateSection key={day} data={daySchedules}>
                <div
                    onClick={() => setSelectedDate(dateObj)}
                    onDragOver={(e) => handleDragOver(e, dateString)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, dateObj)}
                    className={`p-2 border-r border-b border-gray-100 transition-all flex flex-col gap-1 h-[110px] cursor-pointer relative group
                        ${isSelected ? "bg-blue-50/50 ring-1 ring-inset ring-blue-200 z-10" : "bg-white hover:bg-gray-50"}
                        ${isHoveredDropTarget ? "bg-blue-100/60 ring-2 ring-dashed ring-blue-400 z-20 scale-[0.98]" : ""}
                    `}
                >
                    <div className="flex justify-between items-start">
                        <span
                            className={`text-sm font-semibold w-4 h-4 flex items-center justify-center rounded-lg transition-colors
                            ${isToday ? "bg-blue-600 text-white shadow-md" : isSelected ? "text-blue-600" : "text-gray-700 group-hover:text-blue-600"}
                        `}
                        >
                            {day}
                        </span>
                        {daySchedules.length > 0 && (
                            <div className="flex gap-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 mt-1 flex-1 overflow-y-auto max-h-[64px] pr-0.5 custom-scrollbar">
                        {daySchedules.map((schedule) => (
                            <div
                                key={schedule.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, schedule)}
                                className={`text-[10px] font-medium leading-tight px-2 py-1.5 rounded-md border shadow-sm flex flex-col gap-0.5 cursor-grab active:cursor-grabbing hover:brightness-95 transition-all select-none shrink-0 ${schedule.color}`}
                            >
                                <div className="font-bold flex items-center gap-1 truncate">
                                    <span className="w-1 h-1 rounded-full bg-current shrink-0" />
                                    <span className="truncate">{schedule.title}</span>
                                </div>
                                <div className="text-[9px] opacity-75 truncate pl-2">{schedule.time}</div>
                            </div>
                        ))}
                    </div>
                    {daySchedules.length > 3 && (
                        <span className="text-[9px] text-gray-400 font-bold px-1 mt-auto pt-1 block shrink-0">
                            + {daySchedules.length - 3} more
                        </span>
                    )}
                </div>
            </SelectedDateSection>
        );
    });

    return (
        <div className="flex-1 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col relative">

            {/* --- Time Update Modal Overlay --- */}
            {timeEditTarget && (
                <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
                    <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 max-w-sm w-full mx-4 flex flex-col gap-4">
                        <div>
                            <h3 className="text-lg font-black text-gray-900">Adjust Interview Time</h3>
                            <p className="text-xs text-gray-500 font-medium mt-0.5 truncate">
                                Candidate: <strong className="text-gray-700">{timeEditTarget.label}</strong>
                            </p>
                            <p className="text-xs text-blue-600 font-bold mt-1">
                                Target Date: {timeEditTarget.dateObj.toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>

                        <hr className="border-gray-100" />

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-400">Start Time</label>
                                <input
                                    type="time"
                                    value={startTimeInput}
                                    onChange={(e) => setStartTimeInput(e.target.value)}
                                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-400">End Time</label>
                                <input
                                    type="time"
                                    value={endTimeInput}
                                    onChange={(e) => setEndTimeInput(e.target.value)}
                                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 mt-2">
                            <button
                                type="button"
                                disabled={isSavingTime}
                                onClick={() => setTimeEditTarget(null)}
                                className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 active:scale-98 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isSavingTime}
                                onClick={handleConfirmScheduleChange}
                                className="flex-1 py-2 rounded-xl bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 active:scale-98 shadow-md shadow-blue-500/10 transition-all flex items-center justify-center disabled:opacity-50"
                            >
                                {isSavingTime ? "Updating..." : "Save Time"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-white to-gray-50/50">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                        Interview Schedule
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">
                        {selectedDate.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-inner border border-gray-100">
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={handleToday}
                        className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-blue-600 min-w-[140px] rounded-lg hover:bg-gray-50 transition-all"
                    >
                        {currentDate.toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                        })}
                    </button>

                    <button
                        onClick={handleNextMonth}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="p-4 bg-white">
                <div className="grid grid-cols-7 mb-2">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="text-[11px] font-black text-gray-400 uppercase tracking-widest text-center py-2">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 border-t border-l border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    {blanks}
                    {days}
                    {Array.from({
                        length: (7 - ((firstDay + daysInMonth) % 7)) % 7,
                    }).map((_, i) => (
                        <div key={`trail-${i}`} className="min-h-[110px] bg-gray-50/40 border-r border-b border-gray-100" />
                    ))}
                </div>
            </div>
        </div>
    );
}