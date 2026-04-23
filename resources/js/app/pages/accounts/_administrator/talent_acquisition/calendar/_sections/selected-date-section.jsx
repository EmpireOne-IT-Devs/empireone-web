import React from "react";

export default function SelectedDateSection({ selectedDate, setSelectedDate }) {

        const today = new Date();
    const mockSchedules = [
        {
            id: 1,
            title: "UI/UX Interview",
            date: new Date(today.getFullYear(), today.getMonth(), 5),
            time: "10:00 AM",
            duration: "1 hour",
            color: "bg-blue-100 text-blue-700 border-blue-200",
        },
        {
            id: 2,
            title: "Team Sync",
            date: new Date(today.getFullYear(), today.getMonth(), 12),
            time: "09:30 AM",
            duration: "30 mins",
            color: "bg-purple-100 text-purple-700 border-purple-200",
        },
        {
            id: 3,
            title: "Candidate Review",
            date: new Date(today.getFullYear(), today.getMonth(), 12),
            time: "02:00 PM",
            duration: "1.5 hours",
            color: "bg-green-100 text-green-700 border-green-200",
        },
        {
            id: 4,
            title: "Frontend Tech Screen",
            date: new Date(today.getFullYear(), today.getMonth(), 22),
            time: "11:00 AM",
            duration: "1 hour",
            color: "bg-blue-100 text-blue-700 border-blue-200",
        },
        {
            id: 5,
            title: "Offer Negotiation",
            date: new Date(today.getFullYear(), today.getMonth(), 28),
            time: "04:00 PM",
            duration: "30 mins",
            color: "bg-orange-100 text-orange-700 border-orange-200",
        },
    ];
    const selectedDateSchedules = selectedDate
        ? mockSchedules.filter(
              (s) =>
                  s.date.getDate() === selectedDate.getDate() &&
                  s.date.getMonth() === selectedDate.getMonth() &&
                  s.date.getFullYear() === selectedDate.getFullYear(),
          )
        : [];
    return (
        <>
            {selectedDate && (
            
                    <>
                    <div className="w-full lg:w-80 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-auto self-start sticky top-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">
                                    {selectedDate.toLocaleDateString(
                                        "default",
                                        {
                                            weekday: "long",
                                        },
                                    )}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {selectedDate.toLocaleDateString(
                                        "default",
                                        {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        },
                                    )}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedDate(null)}
                                className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors"
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
                                        d="M6 18L18 6M6 6l12 12"
                                    ></path>
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2">
                            {selectedDateSchedules.length > 0 ? (
                                <div className="relative border-l-2 border-gray-100 ml-3 pl-5 flex flex-col gap-6 pt-2 pb-4">
                                    {selectedDateSchedules.map((schedule) => (
                                        <div
                                            key={schedule.id}
                                            className="relative"
                                        >
                                            {/* Timeline Dot */}
                                            <div className="absolute -left-[27px] top-1.5 w-3 h-3 bg-white border-2 border-blue-500 rounded-full"></div>

                                            {/* Event Details */}
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-bold text-gray-500">
                                                    {schedule.time}
                                                </span>
                                                <div
                                                    className={`p-3 rounded-lg border shadow-sm ${schedule.color}`}
                                                >
                                                    <h4 className="font-semibold text-sm mb-1">
                                                        {schedule.title}
                                                    </h4>
                                                    <p className="text-xs opacity-80 flex items-center gap-1">
                                                        <svg
                                                            className="w-3 h-3"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            ></path>
                                                        </svg>
                                                        {schedule.duration}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-40 text-center text-gray-400">
                                    <svg
                                        className="w-12 h-12 mb-3 opacity-20"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                                        ></path>
                                    </svg>
                                    <p className="text-sm">
                                        No events scheduled
                                        <br />
                                        for this day.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    </>
            )}
        </>
    );
}
