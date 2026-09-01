import React from "react";

export default function DayAttendanceComponents({
    day,
    timeIn,
    timeOut,
    isDayOff,
    onChange,
}) {
    return (
        <div className="border rounded-xl p-5 bg-gray-50 space-y-4 w-full">
            <h1 className="font-semibold text-xl">{day}</h1>

            <div className="flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block mb-2 font-medium text-gray-700">
                        Time In
                    </label>
                    <input
                        type="time"
                        value={timeIn}
                        onChange={(e) => onChange({ timeIn: e.target.value })}
                        disabled={isDayOff}
                        className="w-full border rounded-lg p-3 disabled:bg-gray-200 disabled:text-gray-500"
                    />
                </div>

                <div className="flex-1">
                    <label className="block mb-2 font-medium text-gray-700">
                        Time Out
                    </label>
                    <input
                        type="time"
                        value={timeOut}
                        onChange={(e) => onChange({ timeOut: e.target.value })}
                        disabled={isDayOff}
                        className="w-full border rounded-lg p-3 disabled:bg-gray-200 disabled:text-gray-500"
                    />
                </div>

                <div className="pb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isDayOff}
                            onChange={(e) =>
                                onChange({ isDayOff: e.target.checked })
                            }
                            className="w-5 h-5"
                        />
                        <span className="font-medium text-gray-700">
                            Day Off
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
}
