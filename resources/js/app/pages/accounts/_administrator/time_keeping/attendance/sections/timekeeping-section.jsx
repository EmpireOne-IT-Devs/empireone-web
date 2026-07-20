import React, { useEffect, useState } from "react";
import { Clock, LogIn, LogOut } from "lucide-react";
import AttendanceLogs from "./attendance-logs";

export default function TimekeepingSection() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0],
    );
    return (
        <div className="flex flex-1 gap-6">
            <div className="bg-white w-full rounded-2xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Timekeeping Attendance
                        </h2>
                        {/* <p className="text-sm text-gray-500">
                        Track employee attendance and work hours.
                    </p> */}
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center">
                        <div className="">
                            <p className="text-sm text-gray-500">
                                Current Time
                            </p>
                            <div>
                                <p className="text-lg font-bold text-gray-600">
                                    {currentTime.toLocaleDateString("en-US", {
                                        weekday: "long",
                                    })}
                                </p>

                                <p className="text-2xl font-bold text-blue-600">
                                    {currentTime.toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: true,
                                    })}
                                </p>
                            </div>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) =>
                                    setSelectedDate(e.target.value)
                                }
                                className="border rounded-lg px-2 py-2 mt-1 text-sm"
                            />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                Current Status
                            </p>
                            <p className="font-semibold text-green-600">
                                Ready to Clock In
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm">
                        <LogIn size={20} />
                        Clock In
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm">
                        <LogOut size={20} />
                        Break
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm">
                        <LogIn size={20} />
                        Back from Break
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm">
                        <LogOut size={20} />
                        Clock Out
                    </button>
                </div>

                <div className="mt-6 border-t pt-4">
                    <h3 className="font-semibold text-gray-700 mb-3">
                        Today's Record
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">
                                Break Starts
                            </p>
                            <p className="font-bold text-green-700">--:--</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Break Ends</p>
                            <p className="font-bold text-red-700">--:--</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Durations</p>
                            <p className="font-bold text-orange-700">--:--</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-5">
                        <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Clock In</p>
                            <p className="font-bold text-green-700">--:--</p>
                        </div>

                        <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Clock Out</p>
                            <p className="font-bold text-red-700">--:--</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Time In</p>
                            <p className="font-bold text-green-700">8:00 AM</p>
                        </div>

                        <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Time Out</p>
                            <p className="font-bold text-red-700">5:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>
            <AttendanceLogs />
        </div>
    );
}
