import Button from "@/app/_components/button";
import React, { useState } from "react";

export default function SetScheduleSection({ prevStep, nextStep }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const timeSlots = [
        "09:00 AM",
        "10:00 AM",
        "11:00 AM",
        "01:00 PM",
        "02:00 PM",
        "03:00 PM",
        "04:00 PM",
    ];

    // Calendar Helpers
    const getDaysInMonth = (year, month) =>
        new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) =>
        new Date(year, month, 1).getDay();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    // Get today's date with the time stripped out for accurate comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if previous month navigation should be disabled
    const isPrevMonthDisabled =
        currentYear < today.getFullYear() ||
        (currentYear === today.getFullYear() &&
            currentMonth <= today.getMonth());

    // Handlers for month navigation
    const handlePrevMonth = () => {
        if (isPrevMonthDisabled) return;
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
        setSelectedTime(null);
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
        setSelectedTime(null);
    };

    const handleDateClick = (day) => {
        setSelectedDate(new Date(currentYear, currentMonth, day));
        setSelectedTime(null); // Reset time when new date is selected
    };

    const handleConfirm = () => {
        if (selectedDate && selectedTime) {
            alert(
                `Booking confirmed for ${selectedDate.toDateString()} at ${selectedTime}`,
            );
            // Add your API submission logic here
        }
    };

    // Generate blank spaces for the first week
    const blanks = Array.from({ length: firstDay }, (_, i) => (
        <div key={`blank-${i}`} className="p-2 border border-transparent"></div>
    ));

    // Generate actual days
    const days = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;

        // Calculate the exact date of the loop iteration to compare with today
        const loopDate = new Date(currentYear, currentMonth, day);
        const isPast = loopDate < today;

        const isSelected =
            selectedDate?.getDate() === day &&
            selectedDate?.getMonth() === currentMonth &&
            selectedDate?.getFullYear() === currentYear;

        const isToday =
            today.getDate() === day &&
            today.getMonth() === currentMonth &&
            today.getFullYear() === currentYear;

        return (
            <button
                key={day}
                type="button"
                onClick={() => handleDateClick(day)}
                disabled={isPast}
                className={`p-2 w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-all duration-200
                    ${
                        isPast
                            ? "text-gray-300 cursor-not-allowed"
                            : isSelected
                              ? "bg-blue-600 text-white shadow-md"
                              : "hover:bg-blue-100 text-gray-700"
                    }
                    ${isToday && !isSelected && !isPast ? "border-2 border-blue-600 font-bold" : ""}
                `}
            >
                {day}
            </button>
        );
    });

    return (
        <>
            <div className="flex flex-col md:flex-row gap-8 mt-10">
                {/* Left Column: Calendar */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Select a Date
                    </h2>

                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="button"
                            onClick={handlePrevMonth}
                            disabled={isPrevMonthDisabled}
                            className={`p-2 rounded-lg transition-colors
                            ${
                                isPrevMonthDisabled
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "hover:bg-gray-100 text-gray-600"
                            }
                        `}
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
                        <h3 className="text-lg font-semibold text-gray-800">
                            {currentDate.toLocaleString("default", {
                                month: "long",
                                year: "numeric",
                            })}
                        </h3>
                        <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
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

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                        {daysOfWeek.map((day) => (
                            <div
                                key={day}
                                className="text-sm font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center">
                        {blanks}
                        {days}
                    </div>
                </div>

                {/* Right Column: Time Slots */}
                <div className="flex-1 flex flex-col border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        {selectedDate
                            ? "Available Times"
                            : "Select a date first"}
                    </h2>

                    {selectedDate ? (
                        <>
                            <p className="text-gray-500 mb-4">
                                Showing times for{" "}
                                <span className="font-semibold text-gray-800">
                                    {selectedDate.toLocaleDateString()}
                                </span>
                            </p>
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                {timeSlots.map((time) => (
                                    <button
                                        key={time}
                                        type="button"
                                        onClick={() => setSelectedTime(time)}
                                        className={`py-3 px-4 rounded-xl font-medium border transition-all duration-200
                                        ${
                                            selectedTime === time
                                                ? "bg-blue-600 border-blue-600 text-white shadow-md transform scale-[1.02]"
                                                : "border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600"
                                        }
                                    `}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>

                            {/* Sticky Action Button */}
                            {/* <div className="mt-auto pt-4">
                                <button
                                    type="button"
                                    onClick={handleConfirm}
                                    disabled={!selectedTime}
                                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200
                                    ${
                                        selectedTime
                                            ? "bg-gray-900 text-white hover:bg-black shadow-lg hover:shadow-xl"
                                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    }
                                `}
                                >
                                    Confirm Booking
                                </button>
                            </div> */}
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-center">
                            <div className="text-gray-400">
                                <svg
                                    className="w-16 h-16 mx-auto mb-4 opacity-50"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    ></path>
                                </svg>
                                <p>
                                    Please click on a day in the calendar
                                    <br />
                                    to view available times.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-4 pt-20">
                <Button
                    outlined
                    variant="secondary"
                    type="button"
                    onClick={prevStep}
                    className="w-1/2 "
                >
                    Back
                </Button>
                <Button
                    outlined
                    type="button"
                    onClick={nextStep}
                    className="w-1/2 "
                >
                    Continue To Review
                </Button>
            </div>
        </>
    );
}
