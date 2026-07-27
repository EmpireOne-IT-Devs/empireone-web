import { useState } from "react";
import DayAttendanceComponents from "../components/day-attendance-components";

export default function SetAttendanceSection() {
    const [selectedEmployee, setSelectedEmployee] = useState("");

    return (
        <div className="">
            <div className="bg-white rounded-xl shadow-md">
                <div className="border-b px-6 py-4">
                    <h2 className="text-2xl font-bold">Attendance Settings</h2>
                    <p className="text-gray-500 mt-1">
                        Configure an employee's official attendance schedule.
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Employee */}

                    <div>
                        <label className="font-medium block mb-2">
                            Select Employee
                        </label>

                        <select
                            className="w-full border rounded-lg p-3"
                            value={selectedEmployee}
                            onChange={(e) =>
                                setSelectedEmployee(e.target.value)
                            }
                        >
                            <option>Select Employee</option>
                            <option>EMP-001 - John Doe</option>
                            <option>EMP-002 - Jane Smith</option>
                            <option>EMP-003 - Michael Santos</option>
                        </select>
                    </div>

                    {selectedEmployee && (
                        <>
                            <div className="border rounded-lg p-5 bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold">
                                        JD
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            John Doe
                                        </h3>

                                        <p className="text-gray-500">
                                            IT Department
                                        </p>

                                        <p className="text-gray-500">
                                            Software Developer
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <DayAttendanceComponents day="Monday" />
                            <DayAttendanceComponents day="Tuesday" />
                            <DayAttendanceComponents day="Wednesday" />
                            <DayAttendanceComponents day="Thursday" />
                            <DayAttendanceComponents day="Friday" />
                            <DayAttendanceComponents day="Saturday" />
                            <DayAttendanceComponents day="Sunday" />
                            {/* <div className="space-y-3">
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" defaultChecked />
                                    Auto Compute Late
                                </label>

                                <label className="flex items-center gap-3">
                                    <input type="checkbox" defaultChecked />
                                    Auto Compute Undertime
                                </label>

                                <label className="flex items-center gap-3">
                                    <input type="checkbox" defaultChecked />
                                    Apply to Future Attendance
                                </label>
                            </div> */}

                            {/* <div>
                                <label className="font-medium block mb-2">
                                    Remarks
                                </label>

                                <textarea
                                    rows={4}
                                    className="w-full border rounded-lg p-3"
                                    placeholder="Reason for schedule adjustment..."
                                />
                            </div> */}

                            <div className="flex justify-end gap-3">
                                <button className="px-5 py-2 border rounded-lg">
                                    Cancel
                                </button>

                                <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Save Settings
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
