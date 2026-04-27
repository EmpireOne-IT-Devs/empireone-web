import React, { useState } from "react";
import { useSelector } from "react-redux";
import SelectedDateSection from "./selected-date-section";

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

    const today = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const calendarSchedules = (schedules || []).map((sched) => {
        const [year, month, day] = sched.scheduled_date.split("-");
        return {
            id: sched.id,
            title: `${sched?.application?.applicant?.personal_information?.first_name} ${sched?.application?.applicant?.personal_information?.last_name}`,
            date: new Date(year, month - 1, day),
            time: `${formatTime(sched.start_time)} - ${formatTime(sched.end_time)}`,
            color: getColorByStatus(sched.status),
            status: sched.status,
            interviewer: sched?.interviewer?.name,
            meeting_link: sched?.meeting_link,
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

    const blanks = Array.from({ length: firstDay }, (_, i) => (
        <div
            key={`blank-${i}`}
            className="min-h-[110px] bg-gray-50/40 border-r border-b border-gray-100"
        />
    ));

    const days = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const dateObj = new Date(currentYear, currentMonth, day);

        const daySchedules = calendarSchedules.filter(
            (s) =>
                s.date.getDate() === day &&
                s.date.getMonth() === currentMonth &&
                s.date.getFullYear() === currentYear,
        );

        const isToday = today.toDateString() === dateObj.toDateString();
        const isSelected =
            selectedDate.toDateString() === dateObj.toDateString();

        return (
            <SelectedDateSection key={day} data={daySchedules}>
                <div
                    onClick={() => setSelectedDate(dateObj)}
                    className={`p-2 border-r border-b border-gray-100 transition-all flex flex-col gap-1 h-[110px] cursor-pointer group
                        ${isSelected ? "bg-blue-50/50 ring-1 ring-inset ring-blue-200 z-10" : "bg-white hover:bg-gray-50"}
                    `}
                >
                    <div className="flex justify-between items-start">
                        <span
                            className={`text-sm font-semibold w-8 h-8 flex items-center justify-center rounded-lg transition-colors
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

                    <div className="flex flex-col gap-1 mt-1 overflow-hidden">
                        {daySchedules.slice(0, 3).map((schedule) => (
                            <div
                                key={schedule.id}
                                className={`text-[10px] font-medium leading-tight px-2 py-1 rounded-md border shadow-sm truncate flex items-center gap-1 ${schedule.color}`}
                            >
                                <span className="w-1 h-1 rounded-full bg-current" />
                                {schedule.title}
                            </div>
                        ))}
                        {daySchedules.length > 3 && (
                            <span className="text-[9px] text-gray-400 font-bold px-1">
                                + {daySchedules.length - 3} more
                            </span>
                        )}
                    </div>
                </div>
            </SelectedDateSection>
        );
    });

    return (
        <div className="flex-1 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col">
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
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M15 19l-7-7 7-7"
                            />
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
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
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
                <div className="grid grid-cols-7 border-t border-l border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    {blanks}
                    {days}
                    {/* Add trailing blanks if necessary to fill the 7-column row */}
                    {Array.from({
                        length: (7 - ((firstDay + daysInMonth) % 7)) % 7,
                    }).map((_, i) => (
                        <div
                            key={`trail-${i}`}
                            className="min-h-[110px] bg-gray-50/40 border-r border-b border-gray-100"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
