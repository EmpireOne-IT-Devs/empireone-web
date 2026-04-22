import Modal from "@/app/_components/modal";
import React, { useState } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const TIME_SLOTS = [
    "08:00 AM", "08:30 AM",
    "09:00 AM", "09:30 AM",
    "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM",
    "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM",
];

// Simulate some unavailable slots
const UNAVAILABLE_SLOTS = ["09:00 AM", "10:30 AM", "02:00 PM"];

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

export default function SelectInterviewSection({ open, onClose }) {
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [confirmed, setConfirmed] = useState(false);

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };

    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const isPast = (day) => {
        const d = new Date(viewYear, viewMonth, day);
        d.setHours(0, 0, 0, 0);
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return d < t;
    };

    const isWeekend = (day) => {
        const dow = new Date(viewYear, viewMonth, day).getDay();
        return dow === 0 || dow === 6;
    };

    const isSelected = (day) =>
        selectedDate &&
        selectedDate.day === day &&
        selectedDate.month === viewMonth &&
        selectedDate.year === viewYear;

    const isToday = (day) =>
        day === today.getDate() &&
        viewMonth === today.getMonth() &&
        viewYear === today.getFullYear();

    const handleDateClick = (day) => {
        if (isPast(day) || isWeekend(day)) return;
        setSelectedDate({ day, month: viewMonth, year: viewYear });
        setSelectedTime(null);
    };

    const handleConfirm = () => {
        if (selectedDate && selectedTime) setConfirmed(true);
    };

    const handleClose = () => {
        setConfirmed(false);
        setSelectedDate(null);
        setSelectedTime(null);
        onClose();
    };

    const formattedDate = selectedDate
        ? `${MONTHS[selectedDate.month]} ${selectedDate.day}, ${selectedDate.year}`
        : null;

    const calendarCells = [];
    for (let i = 0; i < firstDay; i++) calendarCells.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

    return (
        <Modal
            isOpen={open}
            onClose={handleClose}
            title="Schedule Initial Interview"
            width="max-w-2xl"
        >
            {confirmed ? (
                /* ── Confirmation Screen ── */
                <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Interview Scheduled!</h3>
                    <p className="text-gray-500 text-sm max-w-xs">
                        Your initial interview has been set for
                    </p>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-6 py-4">
                        <p className="text-indigo-700 font-semibold text-base">{formattedDate}</p>
                        <p className="text-indigo-500 text-sm mt-0.5">{selectedTime}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">A confirmation will be sent to your email.</p>
                    <button
                        onClick={handleClose}
                        className="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        Done
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-5 pt-1 pb-2">
                    {/* ── Calendar ── */}
                    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                        {/* Month nav */}
                        <div className="flex items-center justify-between px-5 py-3 bg-indigo-600">
                            <button
                                onClick={prevMonth}
                                className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-indigo-500 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <span className="text-white font-semibold text-sm tracking-wide">
                                {MONTHS[viewMonth]} {viewYear}
                            </span>
                            <button
                                onClick={nextMonth}
                                className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-indigo-500 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Day headers */}
                        <div className="grid grid-cols-7 border-b border-gray-100">
                            {DAYS.map(d => (
                                <div
                                    key={d}
                                    className={`text-center text-xs font-semibold py-2 ${
                                        d === "Sun" || d === "Sat" ? "text-gray-300" : "text-gray-400"
                                    }`}
                                >
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Date grid */}
                        <div className="grid grid-cols-7 p-3 gap-1">
                            {calendarCells.map((day, i) => {
                                if (!day) return <div key={`empty-${i}`} />;
                                const disabled = isPast(day) || isWeekend(day);
                                const sel = isSelected(day);
                                const tod = isToday(day);
                                return (
                                    <button
                                        key={day}
                                        onClick={() => handleDateClick(day)}
                                        disabled={disabled}
                                        className={`
                                            relative aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all
                                            ${disabled
                                                ? "text-gray-200 cursor-not-allowed"
                                                : sel
                                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                                : tod
                                                ? "border-2 border-indigo-400 text-indigo-600 hover:bg-indigo-50"
                                                : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"}
                                        `}
                                    >
                                        {day}
                                        {tod && !sel && (
                                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-400" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="px-4 pb-3 flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded border-2 border-indigo-400 inline-block" />
                                Today
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded bg-indigo-600 inline-block" />
                                Selected
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded bg-gray-100 inline-block" />
                                Unavailable
                            </span>
                        </div>
                    </div>

                    {/* ── Time Slots ── */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-gray-700">
                                {selectedDate
                                    ? `Available slots — ${formattedDate}`
                                    : "Select a date to view time slots"}
                            </p>
                        </div>

                        {selectedDate ? (
                            <div className="grid grid-cols-4 gap-2">
                                {TIME_SLOTS.map(slot => {
                                    const unavailable = UNAVAILABLE_SLOTS.includes(slot);
                                    const picked = selectedTime === slot;
                                    return (
                                        <button
                                            key={slot}
                                            disabled={unavailable}
                                            onClick={() => !unavailable && setSelectedTime(slot)}
                                            className={`
                                                py-2 px-1 rounded-lg text-xs font-medium border transition-all
                                                ${unavailable
                                                    ? "border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed line-through"
                                                    : picked
                                                    ? "border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                                                    : "border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50"}
                                            `}
                                        >
                                            {slot}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-dashed border-gray-200 py-8 flex flex-col items-center gap-2 text-gray-300">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm">No date selected</p>
                            </div>
                        )}
                    </div>

                    {/* ── Summary + CTA ── */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="text-sm text-gray-500">
                            {selectedDate && selectedTime ? (
                                <span>
                                    <span className="font-semibold text-gray-700">{formattedDate}</span>
                                    {" · "}
                                    <span className="text-indigo-600 font-semibold">{selectedTime}</span>
                                </span>
                            ) : (
                                <span className="text-gray-400 text-xs">Pick a date & time to continue</span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={!selectedDate || !selectedTime}
                                className={`
                                    px-5 py-2 rounded-lg text-sm font-semibold transition-all
                                    ${selectedDate && selectedTime
                                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200"
                                        : "bg-gray-100 text-gray-300 cursor-not-allowed"}
                                `}
                            >
                                Confirm Schedule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
}