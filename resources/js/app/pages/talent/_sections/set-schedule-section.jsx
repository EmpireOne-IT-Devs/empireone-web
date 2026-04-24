import Button from "@/app/_components/button";
<<<<<<< HEAD
import { Clock } from "lucide-react";
import React, { useState } from "react";
=======
import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
>>>>>>> defb5f9d43b425ef873a816b01f622c8f5db3cf5

export default function SetScheduleSection({
    prevStep,
    nextStep,
    setValue,
    watchedValues,
}) {
    const { interviewer } = useSelector((store) => store.app);

    // ---------------------------------------------------------
    // Initialize State with Default Values
    // ---------------------------------------------------------
    const [currentDate, setCurrentDate] = useState(() => {
        if (watchedValues?.scheduled_date) {
            // Safely parse YYYY-MM-DD into local time to avoid UTC timezone shifts
            const [y, m, d] = watchedValues.scheduled_date.split("-");
            return new Date(y, m - 1, d);
        }
        return new Date();
    });

    const [selectedDate, setSelectedDate] = useState(() => {
        if (watchedValues?.scheduled_date) {
            const [y, m, d] = watchedValues.scheduled_date.split("-");
            return new Date(y, m - 1, d);
        }
        return null;
    });

    const [selectedTime, setSelectedTime] = useState(
        watchedValues?.start_time || null,
    );

    // ---------------------------------------------------------
    // Sync React State with Form State (react-hook-form)
    // ---------------------------------------------------------
    const calculateEndTime = (timeStr) => {
        if (!timeStr) return null;

        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (hours === 12) {
            hours = modifier === "AM" ? 0 : 12;
        } else if (modifier === "PM") {
            hours += 12;
        }

        const totalMinutes = hours * 60 + minutes + 20;

        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        const ampm = h >= 12 ? "PM" : "AM";
        const formattedH = h % 12 === 0 ? 12 : h % 12;
        const formattedM = m.toString().padStart(2, "0");

        return `${formattedH.toString().padStart(2, "0")}:${formattedM} ${ampm}`;
    };

    useEffect(() => {
        if (selectedDate) {
            const tzOffset = selectedDate.getTimezoneOffset() * 60000;
            const formattedDate = new Date(selectedDate - tzOffset)
                .toISOString()
                .split("T")[0];

            setValue("scheduled_date", formattedDate);
        }
    }, [selectedDate, setValue]);

    useEffect(() => {
        if (selectedTime) {
            setValue("start_time", selectedTime);
            setValue("end_time", calculateEndTime(selectedTime));
        }
    }, [selectedTime, setValue]);

    // ---------------------------------------------------------
    // Dynamic Time Slot Generator (20-minute gaps as Ranges)
    // ---------------------------------------------------------
    const timeSlots = useMemo(() => {
        if (!interviewer?.start_time || !interviewer?.end_time) return [];

        const parseTime = (timeStr) => {
            if (!timeStr) return null;
            const [hours, minutes] = timeStr.split(":").map(Number);
            return hours * 60 + minutes;
        };

        const formatTime = (minutes) => {
            const h = Math.floor(minutes / 60);
            const m = minutes % 60;
            const ampm = h >= 12 ? "PM" : "AM";
            const formattedH = h % 12 === 0 ? 12 : h % 12;
            const formattedM = m.toString().padStart(2, "0");
            return `${formattedH.toString().padStart(2, "0")}:${formattedM} ${ampm}`;
        };

        const startMin = parseTime(interviewer.start_time);
        const endMin = parseTime(interviewer.end_time);
        const breakStartMin = parseTime(interviewer.break_time_start);
        const breakEndMin = parseTime(interviewer.break_time_end);

        const slots = [];

        for (let current = startMin; current + 20 <= endMin; current += 20) {
            if (breakStartMin && breakEndMin) {
                if (current >= breakStartMin && current < breakEndMin) {
                    continue;
                }
            }

            // Format start and end times for the UI
            const startLabel = formatTime(current);
            const endLabel = formatTime(current + 20);

            slots.push({
                start: startLabel,
                display: `${startLabel} -${endLabel}`,
            });
        }

        return slots;
    }, [interviewer]);

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Calendar Helpers
    const getDaysInMonth = (year, month) =>
        new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) =>
        new Date(year, month, 1).getDay();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isPrevMonthDisabled =
        currentYear < today.getFullYear() ||
        (currentYear === today.getFullYear() &&
            currentMonth <= today.getMonth());

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
        setSelectedTime(null);
    };

    const blanks = Array.from({ length: firstDay }, (_, i) => (
        <div key={`blank-${i}`} className="p-2 border border-transparent"></div>
    ));

    const days = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
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
<<<<<<< HEAD
            <div className="text-xl font-semibold text-gray-800 mb-4 md:mb-0 ">
                Please select your preferred date and time for the initial
                interview.
            </div>

            <div className="flex flex-col md:flex-row gap-8 mt-12">
=======
            <div className="flex flex-col lg:flex-row gap-8 mt-10">
>>>>>>> defb5f9d43b425ef873a816b01f622c8f5db3cf5
                {/* Left Column: Calendar */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </span>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Select a Date</h2>
                    </div>

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
<<<<<<< HEAD
                <div className="flex-1 flex flex-col border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                    <div className="flex items-center gap-2 mb-6 min-h-[2.5rem]">
                        {selectedDate ? (
                            <>
                                <Clock className="w-6 h-6 text-blue-600 " />
                                <h2 className="text-xl font-bold text-gray-800">Available Times</h2>
                            </>
                        ) : (
                            <h2 className="text-xl font-bold text-gray-800">Select a date first</h2>
                        )}
                    </div>
                            
=======
                <div className="flex-1 flex flex-col border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        {selectedDate
                            ? "Available Times"
                            : "Select a date first"}
                    </h2>

>>>>>>> defb5f9d43b425ef873a816b01f622c8f5db3cf5
                    {selectedDate ? (
                        <>
                            <p className="text-gray-500 mb-4">
                                Showing times for{" "}
                                <span className="font-semibold text-gray-800">
                                    {selectedDate.toLocaleDateString()}
                                </span>
                            </p>

                            {timeSlots.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                                    {timeSlots.map((slot) => (
                                        <button
                                            key={slot.start}
                                            type="button"
                                            onClick={() =>
                                                setSelectedTime(slot.start)
                                            }
                                            className={`py-3 px-4 rounded-xl font-medium text-sm border transition-all duration-200 
                                            ${
                                                selectedTime === slot.start
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-md transform scale-[1.02]"
                                                    : "border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600"
                                            }
                                        `}
                                        >
                                            {slot.display}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 mt-10">
                                    No available times for this date.
                                </div>
                            )}
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
                    className="w-1/2"
                >
                    Back
                </Button>
                <Button
                    outlined
                    type="button"
                    onClick={nextStep}
                    disabled={!selectedDate || !selectedTime}
                    className="w-1/2"
                >
                    Continue To Review
                </Button>
            </div>
        </>
    );
}
