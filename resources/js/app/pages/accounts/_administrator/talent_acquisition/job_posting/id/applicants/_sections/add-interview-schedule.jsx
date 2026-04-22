import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import { BriefcaseIcon } from "lucide-react";
import React, { useState } from "react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const TIME_OPTIONS = [
    "07:00 AM",
    "07:30 AM",
    "08:00 AM",
    "08:30 AM",
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
];

// FIX 2: Convert time string like "09:00 AM" to comparable minutes since midnight
function timeToMinutes(timeStr) {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
}

function getDaysInMonth(y, m) {
    return new Date(y, m + 1, 0).getDate();
}
function getFirstDay(y, m) {
    return new Date(y, m, 1).getDay();
}

function formatDate(d) {
    if (!d) return null;
    return `${MONTHS[d.month].slice(0, 3)} ${d.day}, ${d.year}`;
}

function toComparable(d) {
    if (!d) return null;
    return d.year * 10000 + d.month * 100 + d.day;
}

// FIX 1: Accept onOpen prop instead of calling nonexistent setOpen
export default function AddInterviewSchedule({ open, onClose, onOpen }) {
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    const [rangeStart, setRangeStart] = useState(null);
    const [rangeEnd, setRangeEnd] = useState(null);
    const [hoveredDay, setHoveredDay] = useState(null);

    const [startTime, setStartTime] = useState("09:00 AM");
    const [endTime, setEndTime] = useState("05:00 PM");
    const [slotDuration, setSlotDuration] = useState(30);
    const [blockedDays, setBlockedDays] = useState([0, 6]);
    const [notes, setNotes] = useState("");
    const [saved, setSaved] = useState(false);
    const [errors, setErrors] = useState({});

    const prevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear((y) => y - 1);
        } else setViewMonth((m) => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear((y) => y + 1);
        } else setViewMonth((m) => m + 1);
    };

    const isPast = (day) => {
        const d = new Date(viewYear, viewMonth, day);
        d.setHours(0, 0, 0, 0);
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return d < t;
    };

    const dayOfWeek = (day) => new Date(viewYear, viewMonth, day).getDay();

    const handleDayClick = (day) => {
        if (isPast(day)) return;
        const clicked = { day, month: viewMonth, year: viewYear };
        if (!rangeStart || (rangeStart && rangeEnd)) {
            setRangeStart(clicked);
            setRangeEnd(null);
        } else {
            const cmp = toComparable(clicked);
            const scmp = toComparable(rangeStart);
            if (cmp < scmp) {
                setRangeStart(clicked);
                setRangeEnd(null);
            } else if (cmp === scmp) {
                setRangeStart(null);
            } else {
                setRangeEnd(clicked);
            }
        }
    };

    const isInRange = (day) => {
        const ref = { day, month: viewMonth, year: viewYear };
        const cmp = toComparable(ref);
        const hov = hoveredDay
            ? toComparable({
                  day: hoveredDay,
                  month: viewMonth,
                  year: viewYear,
              })
            : null;
        const s = toComparable(rangeStart);
        const e = rangeEnd
            ? toComparable(rangeEnd)
            : hov && rangeStart && !rangeEnd
              ? hov
              : null;
        if (!s || !e) return false;
        return cmp > Math.min(s, e) && cmp < Math.max(s, e);
    };

    const isRangeStart = (day) =>
        rangeStart &&
        rangeStart.day === day &&
        rangeStart.month === viewMonth &&
        rangeStart.year === viewYear;

    const isRangeEnd = (day) =>
        rangeEnd &&
        rangeEnd.day === day &&
        rangeEnd.month === viewMonth &&
        rangeEnd.year === viewYear;

    const isHoverRange = (day) => {
        if (rangeStart && !rangeEnd && hoveredDay) {
            const s = toComparable(rangeStart);
            const h = toComparable({
                day: hoveredDay,
                month: viewMonth,
                year: viewYear,
            });
            const c = toComparable({ day, month: viewMonth, year: viewYear });
            return c > Math.min(s, h) && c < Math.max(s, h);
        }
        return false;
    };

    const toggleBlockedDay = (dow) => {
        setBlockedDays((prev) =>
            prev.includes(dow) ? prev.filter((d) => d !== dow) : [...prev, dow],
        );
    };

    const validate = () => {
        const e = {};
        if (!rangeStart) e.range = "Please select a start date.";
        if (!rangeEnd) e.range = "Please select both start and end dates.";
        // FIX 2: Compare using minutes instead of raw strings
        if (timeToMinutes(startTime) >= timeToMinutes(endTime))
            e.time = "Start time must be before end time.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        setSaved(true);
    };

    const handleClose = () => {
        setSaved(false);
        setRangeStart(null);
        setRangeEnd(null);
        setHoveredDay(null);
        setStartTime("09:00 AM");
        setEndTime("05:00 PM");
        setSlotDuration(30);
        setBlockedDays([0, 6]);
        setNotes("");
        setErrors({});
        onClose();
    };

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDay(viewYear, viewMonth);
    const cells = [
        ...Array(firstDay).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const usableDayCount = (() => {
        if (!rangeStart || !rangeEnd) return null;
        let count = 0;
        const s = new Date(rangeStart.year, rangeStart.month, rangeStart.day);
        const e = new Date(rangeEnd.year, rangeEnd.month, rangeEnd.day);
        for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
            if (!blockedDays.includes(d.getDay())) count++;
        }
        return count;
    })();

    return (
        <>
            {/* FIX 1: Use onOpen prop instead of nonexistent setOpen */}

            <Modal
                isOpen={open}
                onClose={handleClose}
                title={
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                            <BriefcaseIcon />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                                Applicants
                            </p>
                            <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                Add Interview Schedule
                            </h2>
                        </div>
                    </div>
                }
                width="max-w-3xl"
            >
                {saved ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-emerald-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">
                            Schedule Published!
                        </h3>
                        <p className="text-gray-500 text-sm max-w-xs">
                            Applicants can now book their interview slots
                            within:
                        </p>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 text-left space-y-2 min-w-[260px]">
                            <Row label="From" value={formatDate(rangeStart)} />
                            <Row label="To" value={formatDate(rangeEnd)} />
                            <Row
                                label="Hours"
                                value={`${startTime} – ${endTime}`}
                            />
                            <Row label="Slot" value={`${slotDuration} min`} />
                            {usableDayCount !== null && (
                                <Row
                                    label="Working days"
                                    value={`${usableDayCount} days`}
                                />
                            )}
                        </div>
                        <button
                            onClick={handleClose}
                            className="mt-4 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5 pt-1 pb-2">
                        <SectionLabel
                            step="1"
                            title="Select Date Range"
                            subtitle="Click to set start, click again to set end"
                        />

                        <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="flex items-center justify-between px-5 py-3 bg-slate-800">
                                <button
                                    onClick={prevMonth}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                </button>
                                <span className="text-white font-semibold text-sm tracking-wide">
                                    {MONTHS[viewMonth]} {viewYear}
                                </span>
                                <button
                                    onClick={nextMonth}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-7 bg-slate-50 border-b border-gray-100">
                                {DAYS.map((d) => (
                                    <div
                                        key={d}
                                        className="text-center text-xs font-semibold py-2 text-slate-400"
                                    >
                                        {d}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 p-2 gap-y-1">
                                {cells.map((day, i) => {
                                    if (!day) return <div key={`e-${i}`} />;
                                    const past = isPast(day);
                                    const dow = dayOfWeek(day);
                                    const blocked = blockedDays.includes(dow);
                                    const disabled = past || blocked;
                                    // FIX 3: Compute isHoverRange once to avoid double-call
                                    const hovered = isHoverRange(day);
                                    const inRange = isInRange(day) || hovered;
                                    const isStart = isRangeStart(day);
                                    const isEnd = isRangeEnd(day);
                                    const isEndpoint = isStart || isEnd;
                                    return (
                                        <div
                                            key={day}
                                            className={`relative flex items-center justify-center ${inRange ? "bg-slate-100" : ""} ${isStart ? "rounded-l-full" : ""} ${isEnd ? "rounded-r-full" : ""}`}
                                        >
                                            <button
                                                onClick={() =>
                                                    handleDayClick(day)
                                                }
                                                onMouseEnter={() =>
                                                    !rangeEnd &&
                                                    setHoveredDay(day)
                                                }
                                                onMouseLeave={() =>
                                                    setHoveredDay(null)
                                                }
                                                disabled={disabled}
                                                className={`
                                                    w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all z-10 relative
                                                    ${
                                                        disabled
                                                            ? "text-gray-200 cursor-not-allowed"
                                                            : isEndpoint
                                                              ? "bg-slate-800 text-white shadow"
                                                              : inRange
                                                                ? "text-slate-700 hover:bg-slate-200"
                                                                : "text-gray-700 hover:bg-slate-100"
                                                    }
                                                `}
                                            >
                                                {day}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="px-4 pb-3 flex items-center gap-2 text-xs">
                                {rangeStart || rangeEnd ? (
                                    <div className="flex items-center gap-1.5 bg-slate-800 text-white px-3 py-1.5 rounded-full">
                                        <span>
                                            {rangeStart
                                                ? formatDate(rangeStart)
                                                : "—"}
                                        </span>
                                        <svg
                                            className="w-3 h-3 text-slate-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                        <span>
                                            {rangeEnd
                                                ? formatDate(rangeEnd)
                                                : "select end…"}
                                        </span>
                                        {usableDayCount !== null && (
                                            <span className="ml-2 bg-slate-600 px-2 py-0.5 rounded-full text-slate-300">
                                                {usableDayCount}d
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-gray-400">
                                        Click a date to begin selection
                                    </span>
                                )}
                            </div>
                        </div>
                        {errors.range && (
                            <p className="text-xs text-red-500 -mt-3">
                                {errors.range}
                            </p>
                        )}

                        <SectionLabel
                            step="2"
                            title="Block Days of Week"
                            subtitle="Applicants cannot book on blocked days"
                        />
                        <div className="flex gap-2 flex-wrap -mt-2">
                            {DAY_LABELS.map((label, dow) => {
                                const isBlocked = blockedDays.includes(dow);
                                return (
                                    <button
                                        key={dow}
                                        onClick={() => toggleBlockedDay(dow)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                                            ${
                                                isBlocked
                                                    ? "bg-red-50 border-red-200 text-red-500 line-through"
                                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                                            }`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>

                        <SectionLabel
                            step="3"
                            title="Interview Time Window"
                            subtitle="Daily hours applicants can choose from"
                        />
                        <div className="flex items-center gap-3 -mt-2">
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 mb-1 block">
                                    Start Time
                                </label>
                                <select
                                    value={startTime}
                                    onChange={(e) =>
                                        setStartTime(e.target.value)
                                    }
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                >
                                    {TIME_OPTIONS.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end pb-2 text-gray-400 text-sm">
                                →
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 mb-1 block">
                                    End Time
                                </label>
                                <select
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                >
                                    {TIME_OPTIONS.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {errors.time && (
                            <p className="text-xs text-red-500 -mt-3">
                                {errors.time}
                            </p>
                        )}

                        <SectionLabel
                            step="4"
                            title="Slot Duration"
                            subtitle="Length of each interview slot"
                        />
                        <div className="flex gap-2 -mt-2">
                            {[15, 30, 45, 60].map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setSlotDuration(d)}
                                    className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all
                                        ${
                                            slotDuration === d
                                                ? "bg-slate-800 border-slate-800 text-white"
                                                : "bg-white border-gray-200 text-gray-600 hover:border-slate-400"
                                        }`}
                                >
                                    {d} min
                                </button>
                            ))}
                        </div>

                        <SectionLabel
                            step="5"
                            title="Notes for Applicant"
                            subtitle="Optional instructions shown on the booking screen"
                        />
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            placeholder="e.g. Please be online 5 minutes before your scheduled time…"
                            className="w-full -mt-2 text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-slate-300 placeholder-gray-300"
                        />

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-400">
                                {rangeStart && rangeEnd
                                    ? `${formatDate(rangeStart)} – ${formatDate(rangeEnd)} · ${startTime} to ${endTime} · ${slotDuration}min slots`
                                    : "Configure the schedule above"}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-5 py-2 rounded-lg text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white shadow-sm transition-all"
                                >
                                    Publish Schedule
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}

function SectionLabel({ step, title, subtitle }) {
    return (
        <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {step}
            </span>
            <div>
                <p className="text-sm font-semibold text-gray-800">{title}</p>
                {subtitle && (
                    <p className="text-xs text-gray-400">{subtitle}</p>
                )}
            </div>
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-gray-400">{label}</span>
            <span className="text-xs font-semibold text-gray-700">{value}</span>
        </div>
    );
}
