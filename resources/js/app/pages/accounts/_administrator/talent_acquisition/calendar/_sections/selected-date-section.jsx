import React from "react";
import { useSelector } from "react-redux";

// Helper to format "HH:MM:SS" to "hh:mm AM/PM"
const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hourString, minute] = timeString.split(":");
    const hour = parseInt(hourString, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour.toString().padStart(2, "0")}:${minute} ${ampm}`;
};

// Helper to calculate duration between "HH:MM:SS" and "HH:MM:SS"
const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return "";
    const start = new Date(`1970-01-01T${startTime}Z`);
    const end = new Date(`1970-01-01T${endTime}Z`);
    const diffMins = Math.round((end - start) / 60000);

    if (diffMins >= 60) {
        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        return `${hours} hr${hours > 1 ? "s" : ""} ${mins > 0 ? `${mins} mins` : ""}`.trim();
    }
    return `${diffMins} mins`;
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

export default function SelectedDateSection({ selectedDate, setSelectedDate }) {
    const { schedules } = useSelector((store) => store.talent_acquisitions);
    console.log("schedules", schedules);
    // Filter and transform Redux schedules based on the selected date
    const selectedDateSchedules = selectedDate
        ? (schedules || [])
              .filter((sched) => {
                  // Split to avoid UTC timezone offset issues
                  const [year, month, day] = sched.scheduled_date.split("-");
                  return (
                      parseInt(year, 10) === selectedDate.getFullYear() &&
                      parseInt(month, 10) - 1 === selectedDate.getMonth() &&
                      parseInt(day, 10) === selectedDate.getDate()
                  );
              })
              .map((sched) => ({
                  id: sched.id,
                  title: `${sched?.application?.applicant?.personal_information?.first_name} ${sched?.application?.applicant?.personal_information?.last_name}`,
                  time: `${formatTime(sched.start_time)} - ${formatTime(sched.end_time)}`,
                  duration: calculateDuration(sched.start_time, sched.end_time),
                  color: getColorByStatus(sched.status),
                  meeting_link: sched.meeting_link,
                  interviewer: sched?.interviewer?.name,
              }))
              // Optional: Sort chronologically by start_time
              .sort((a, b) => {
                  const timeA = new Date(`1970/01/01 ${a.time}`);
                  const timeB = new Date(`1970/01/01 ${b.time}`);
                  return timeA - timeB;
              })
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
                                                    <h4 className="font-semibold text-md mb-1">
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

                                                    <a className="text-xs opacity-80 flex items-center gap-1.5 transition-opacity hover:opacity-100 mt-1 cursor-pointer">
                                                        {/* User Icon */}
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
                                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                            />
                                                        </svg>
                                                        Interviewer:{" "}
                                                        {schedule.interviewer}
                                                    </a>
                                                    <a
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        href={
                                                            schedule.meeting_link
                                                        }
                                                        className="text-xs opacity-80 flex items-center gap-1 hover:opacity-100 hover:underline transition-opacity mt-1"
                                                    >
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
                                                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                            ></path>
                                                        </svg>
                                                        Google Meet
                                                    </a>
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
