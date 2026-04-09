import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function CalendarSection() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));

    const monthNames = [
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

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        while (days.length % 7 !== 0) {
            days.push(null);
        }
        return days;
    };

    const previousMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        );
    };

    const nextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        );
    };

    const isToday = (day) => {
        if (!day) return false;
        const today = new Date();
        return (
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
        );
    };

    const days = getDaysInMonth(currentDate);

    return (
        <div className="w-full rounded-2xl mx-auto p-6 bg-white border shadow-xl  mt-6">
            <div className="flex items-center justify-between mb-10 ">
                <h2 className="text-xl font-semibold text-gray-900">
                    {monthNames[currentDate.getMonth()]}{" "}
                    {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={previousMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
                    >
                        <FaChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
                    >
                        <FaChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-4 mb-2">
                {daysOfWeek.map((day) => (
                    <div
                        key={day}
                        className="text-center text-sm font-medium text-gray-500"
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-4">
                {days.map((day, index) =>
                    day ? (
                        <div
                            key={index}
                            className={`relative bg-white aspect-square rounded-xl border transition-all
                ${
                    isToday(day)
                        ? "border-blue-500 bg-blue-50 shadow-[0_0_0_2px_#3b82f6]"
                        : "border-gray-200"
                }   
            `}
                        >
                            <div
                                className={`absolute top-3 right-4 text-sm font-medium ${
                                    isToday(day)
                                        ? "text-blue-600"
                                        : "text-gray-900"
                                }`}
                            >
                                {day}
                            </div>
                        </div>
                    ) : (
                        <div key={index} />
                    )
                )}
            </div>
        </div>
    );
}
