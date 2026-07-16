import Button from "@/app/_components/button";
import Radio from "@/app/_components/radio";
import { Clock } from "lucide-react";
import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";

export default function SetScheduleSection({
    prevStep,
    nextStep,
    setValue,
    watchedValues,
    register,
    errors
}) {
    const { job_postings } = useSelector((store) => store.job_postings);

    // Extract interviewers array based on the selected job posting
    const interviewers = useMemo(() => {
        return job_postings.find(
            (res) => res.id == watchedValues.job_posting_id
        )?.job_requisition?.interviewer_users || [];
    }, [job_postings, watchedValues.job_posting_id]);
console.log('interviewers',interviewers)
    // ---------------------------------------------------------
    // Initialize State with Default Values
    // ---------------------------------------------------------
    const [currentDate, setCurrentDate] = useState(() => {
        if (watchedValues?.scheduled_date) {
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

    // Store the full selected slot object to track WHICH interviewer was selected
    const [selectedSlot, setSelectedSlot] = useState(null);

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
        if (selectedSlot) {
            setValue("start_time", selectedSlot.start);
            setValue("end_time", calculateEndTime(selectedSlot.start));
            
            // Set the specific interviewer_id for this time slot
            setValue("interviewer_id", selectedSlot.interviewer_id);
        }
    }, [selectedSlot, setValue]);

    // ---------------------------------------------------------
    // Dynamic Time Slot Generator (20-minute gaps as Ranges)
    // ---------------------------------------------------------
    const timeSlots = useMemo(() => {
        if (!interviewers || interviewers.length === 0 || !selectedDate) return [];

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

        const formattedSelectedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
        const dayOfWeek = selectedDate.getDay();

        const now = new Date();
        const isToday =
            selectedDate.getDate() === now.getDate() &&
            selectedDate.getMonth() === now.getMonth() &&
            selectedDate.getFullYear() === now.getFullYear();

        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const slots = [];

        // Generate slots independently for each interviewer
        interviewers.forEach((inv, index) => {
            // 1. Check if this specific interviewer is scheduled to work today
            let worksToday = false;
            const fromDay = inv.day_of_week_from;
            const toDay = inv.day_of_week_to;

            if (fromDay != null && toDay != null) {
                if (fromDay <= toDay) {
                    worksToday = dayOfWeek >= fromDay && dayOfWeek <= toDay;
                } else {
                    worksToday = dayOfWeek >= fromDay || dayOfWeek <= toDay;
                }
            }

            if (!worksToday) return; // Skip this interviewer if they don't work today

            const sMin = parseTime(inv.start_time);
            const eMin = parseTime(inv.end_time);
            const bStart = parseTime(inv.break_time_start);
            const bEnd = parseTime(inv.break_time_end);

            if (sMin === null || eMin === null) return;

            // 2. Fetch bookings specifically for this interviewer
            const bookedMins = (inv.upcoming_schedules || [])
                .filter((sch) => sch.scheduled_date === formattedSelectedDate)
                .map((sch) => parseTime(sch.start_time))
                .filter((val) => val !== null);

            // 3. Generate their individual slots
            for (let current = sMin; current + 20 <= eMin; current += 20) {
                // Ignore break times
                if (bStart !== null && bEnd !== null && current >= bStart && current < bEnd) {
                    continue;
                }

                const isPast = isToday && current < currentMinutes;
                const isBooked = bookedMins.includes(current);

                const startLabel = formatTime(current);
                const endLabel = formatTime(current + 20);

                slots.push({
                    id: `${inv.interviewer_id}-${current}`, // Unique identifier for selection state
                    start: startLabel,
                    display: `${startLabel} - ${endLabel}`,
                    interviewer_id: inv.interviewer_id,
                    interviewer_label: `Int. ${index + 1}`, // Optional label for the UI
                    isDisabled: isPast || isBooked,
                });
            }
        });

        // Sort all generated slots chronologically across all interviewers
        return slots.sort((a, b) => {
            const timeA = parseTime(a.start);
            const timeB = parseTime(b.start);
            if (timeA === timeB) return a.interviewer_id - b.interviewer_id;
            return timeA - timeB;
        });
    }, [interviewers, selectedDate]);

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Calendar Helpers
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    // Set Up Boundaries: Today and 1 Week Ahead (Max Date)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 7); // Exactly 1 week from today

    const isPrevMonthDisabled =
        currentYear < today.getFullYear() ||
        (currentYear === today.getFullYear() && currentMonth <= today.getMonth());

    const isNextMonthDisabled =
        currentYear > maxDate.getFullYear() ||
        (currentYear === maxDate.getFullYear() && currentMonth >= maxDate.getMonth());

    const handlePrevMonth = () => {
        if (isPrevMonthDisabled) return;
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
        setSelectedSlot(null);
    };

    const handleNextMonth = () => {
        if (isNextMonthDisabled) return;
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
        setSelectedSlot(null);
    };

    const handleDateClick = (day) => {
        setSelectedDate(new Date(currentYear, currentMonth, day));
        setSelectedSlot(null);
    };

    const blanks = Array.from({ length: firstDay }, (_, i) => (
        <div key={`blank-${i}`} className="p-2 border border-transparent"></div>
    ));

    const days = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const loopDate = new Date(currentYear, currentMonth, day);
        const dayOfWeek = loopDate.getDay();

        // Check if the date is earlier than today or beyond the 1-week limit
        const isPast = loopDate < today; 
        const isBeyondMax = loopDate > maxDate;

        // Verify if AT LEAST ONE interviewer is scheduled to work on this dayOfWeek
        let isWorkingDay = false;
        if (interviewers && interviewers.length > 0) {
            isWorkingDay = interviewers.some((inv) => {
                const fromDay = inv.day_of_week_from;
                const toDay = inv.day_of_week_to;

                if (fromDay != null && toDay != null) {
                    if (fromDay <= toDay) {
                        return dayOfWeek >= fromDay && dayOfWeek <= toDay;
                    } else {
                        return dayOfWeek >= fromDay || dayOfWeek <= toDay;
                    }
                }
                return false;
            });
        }

        // Disable if it's out of bounds or no one is working
        const isDisabled = isPast || isBeyondMax || !isWorkingDay;

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
                disabled={isDisabled}
                className={`p-2 w-10 h-10 mx-auto rounded-full flex items-center justify-center transition-all duration-200
                    ${isDisabled
                        ? "text-gray-300 bg-gray-50 cursor-not-allowed"
                        : isSelected
                            ? "bg-blue-600 text-white shadow-md"
                            : "hover:bg-blue-100 text-gray-700"
                    }
                    ${isToday && !isSelected && !isDisabled ? "border-2 border-blue-600 font-bold" : ""}
                `}
            >
                {day}
            </button>
        );
    });

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="text-xl font-semibold text-gray-800 mb-4 md:mb-0 ">
                    Please select your preferred date and time for the initial
                    interview.
                </div>

                <div className="flex gap-5">
                    <Radio
                        label="Face to Face"
                        name="interview_type"
                        value={"Face to Face"}
                        {...register("interview_type", {
                            required:
                                "Interview type is required.",
                        })}
                    />
                    <Radio
                        label="Virtual"
                        name="interview_type"
                        value={'Virtual'}
                        {...register("interview_type", {
                            required:
                                "Interview type is required.",
                        })}
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 mt-12">
                {/* Left Column: Calendar */}
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                            <svg
                                className="w-5 h-5 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </span>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                            Select a Date
                        </h2>
                    </div>

                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="button"
                            onClick={handlePrevMonth}
                            disabled={isPrevMonthDisabled}
                            className={`p-2 rounded-lg transition-colors
                            ${isPrevMonthDisabled
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "hover:bg-gray-100 text-gray-600"
                                }
                        `}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
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
                            disabled={isNextMonthDisabled}
                            className={`p-2 rounded-lg transition-colors
                            ${isNextMonthDisabled
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "hover:bg-gray-100 text-gray-600"
                                }
                        `}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
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
                    <div className="flex items-center gap-2 mb-6 min-h-[2.5rem]">
                        {selectedDate ? (
                            <>
                                <Clock className="w-6 h-6 text-blue-600 " />
                                <h2 className="text-xl font-bold text-gray-800">
                                    Available Times
                                </h2>
                            </>
                        ) : (
                            <h2 className="text-xl font-bold text-gray-800">
                                Select a date first
                            </h2>
                        )}
                    </div>

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
                                            key={slot.id} // Updated key to support duplicates of the same time mapped to different interviewers
                                            type="button"
                                            onClick={() => setSelectedSlot(slot)} // Store the whole slot object
                                            disabled={slot.isDisabled}
                                            className={`py-3 px-4 rounded-xl flex flex-col items-center justify-center border transition-all duration-200 
                                            ${slot.isDisabled
                                                    ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                                                    : selectedSlot?.id === slot.id
                                                        ? "bg-blue-600 border-blue-600 text-white shadow-md transform scale-[1.02]"
                                                        : "border-gray-200 text-gray-700 hover:border-blue-600 hover:text-blue-600"
                                                }
                                        `}
                                        >
                                            <span className="font-medium text-sm">{slot.display}</span>
                                            {/* Optional: Add a subtle indicator so users know they are distinct slots */}
                                            <span className={`text-[10px] mt-0.5 ${selectedSlot?.id === slot.id ? 'text-blue-200' : 'text-gray-400'}`}>
                                                ({slot.interviewer_label})
                                            </span>
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
                    disabled={!selectedDate || !selectedSlot}
                    className="w-1/2"
                >
                    Continue To Review
                </Button>
            </div>
        </>
    );
}