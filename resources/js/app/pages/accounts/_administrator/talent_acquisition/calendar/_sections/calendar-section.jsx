import React, { useState } from "react";
import { useSelector } from "react-redux";
// import InterviewerSection from "./interviewer-section"; // Uncomment if used in this file

// Helper to format "HH:MM:SS" to "hh:mm AM/PM"
const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hourString, minute] = timeString.split(":");
    const hour = parseInt(hourString, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour.toString().padStart(2, "0")}:${minute} ${ampm}`;
};

// Helper to assign a color based on the interview status
const getColorByStatus = (status) => {
    switch (status?.toLowerCase()) {
        case "scheduled":
            return "bg-green-100 text-green-700 border-green-200";
        case "pending":
            return "bg-orange-100 text-orange-700 border-orange-200";
        default:
            return "bg-blue-100 text-blue-700 border-blue-200";
    }
};

export default function CalendarSection({ selectedDate, setSelectedDate }) {
    const { schedules } = useSelector((store) => store.talent_acquisitions);
    const [currentDate, setCurrentDate] = useState(new Date());

    const today = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
console.log('schedules',schedules)
    // Transform Redux schedules to match calendar requirements
    const calendarSchedules = (schedules || []).map((sched) => {
        // Split to avoid UTC timezone offset issues when creating the Date object
        const [year, month, day] = sched.scheduled_date.split("-");

        return {
            id: sched.id,
            title:`${sched?.application?.applicant?.personal_information?.first_name} ${sched?.application?.applicant?.personal_information?.last_name}`,
            date: new Date(year, month - 1, day),
            time: formatTime(sched.start_time),
            color: getColorByStatus(sched.status),
        };
    });

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Calendar Helpers
    const getDaysInMonth = (year, month) =>
        new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) =>
        new Date(year, month, 1).getDay();

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    // Navigation Handlers
    const handlePrevMonth = () =>
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    const handleNextMonth = () =>
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    const handleToday = () => setCurrentDate(new Date());

    const handleDayClick = (day) => {
        setSelectedDate(new Date(currentYear, currentMonth, day));
    };

    // Generate blank spaces for the first week
    const blanks = Array.from({ length: firstDay }, (_, i) => (
        <div
            key={`blank-${i}`}
            className="min-h-[100px] p-2 bg-gray-50/50 border border-gray-100"
        ></div>
    ));

    // Generate actual days
    const days = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;

        // Find transformed schedules for this specific day
        const daySchedules = calendarSchedules.filter(
            (schedule) =>
                schedule.date.getDate() === day &&
                schedule.date.getMonth() === currentMonth &&
                schedule.date.getFullYear() === currentYear,
        );

        const isToday =
            today.getDate() === day &&
            today.getMonth() === currentMonth &&
            today.getFullYear() === currentYear;

        const isSelected =
            selectedDate?.getDate() === day &&
            selectedDate?.getMonth() === currentMonth &&
            selectedDate?.getFullYear() === currentYear;

        return (
            <div
                key={day}
                onClick={() => handleDayClick(day)}
                className={`min-h-[100px] p-2 border border-gray-100 transition-all flex flex-col gap-1 cursor-pointer
                    ${isToday ? "bg-blue-50/30" : "bg-white hover:bg-gray-50"}
                    ${isSelected ? "ring-2 ring-inset ring-blue-500 bg-blue-50/10 shadow-inner" : ""}
                `}
            >
                <div className="flex justify-between items-center mb-1">
                    <span
                        className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                        ${isToday ? "bg-blue-600 text-white shadow-sm" : "text-gray-600"}
                    `}
                    >
                        {day}
                    </span>
                    {daySchedules.length > 0 && (
                        <span className="text-xs text-gray-400 font-medium">
                            {daySchedules.length}
                        </span>
                    )}
                </div>

                {/* Render Schedule Chips */}
                <div className="flex flex-col gap-1 overflow-y-auto max-h-[60px] no-scrollbar">
                    {daySchedules.map((schedule) => (
                        <div
                            key={schedule.id}
                            className={`text-[10px] leading-tight px-1.5 py-0.5 rounded border truncate ${schedule.color}`}
                            title={`${schedule.time} - ${schedule.title}`}
                        >
                            {schedule.time} - {schedule.title}
                        </div>
                    ))}
                </div>
            </div>
        );
    });

    return (
        <>
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                {/* Header: Title & Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Schedule Overview
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Click on a day to view specific hourly schedules.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
                        <button
                            onClick={handlePrevMonth}
                            className="p-2 rounded hover:bg-white hover:shadow-sm text-gray-600 transition-all"
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
                                    strokeWidth="2"
                                    d="M15 19l-7-7 7-7"
                                ></path>
                            </svg>
                        </button>

                        <button
                            onClick={handleToday}
                            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors w-32 text-center"
                        >
                            {currentDate.toLocaleString("default", {
                                month: "long",
                                year: "numeric",
                            })}
                        </button>

                        <button
                            onClick={handleNextMonth}
                            className="p-2 rounded hover:bg-white hover:shadow-sm text-gray-600 transition-all"
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
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="w-full">
                    {/* Days of the Week Header */}
                    <div className="grid grid-cols-7 border-t border-l border-gray-100 bg-gray-50/50 rounded-t-lg overflow-hidden">
                        {daysOfWeek.map((day) => (
                            <div
                                key={day}
                                className="text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 text-center border-r border-b border-gray-100"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 border-l border-gray-100">
                        {blanks}
                        {days}
                    </div>
                </div>
            </div>
        </>
    );
}
