import { useState } from "react";
import DayAttendanceComponents from "../components/day-attendance-components";
import { useSelector } from "react-redux";

export default function SetAttendanceSection() {
    const { employees, employeesLoading } = useSelector(
        (store) => store.human_resources,
    );
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

    const selectedEmployee = employees.find(
        (employee) => employee.id.toString() === selectedEmployeeId.toString(),
    );
    console.log("employssdadees", employees);
    console.log("selectedEmployee", selectedEmployee);
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
                            value={selectedEmployeeId}
                            onChange={(e) =>
                                setSelectedEmployeeId(e.target.value)
                            }
                        >
                            <option value="">Select Employee</option>

                            {[...employees]
                                .sort((a, b) => {
                                    const lastNameA =
                                        a.personal_information?.last_name || "";
                                    const lastNameB =
                                        b.personal_information?.last_name || "";

                                    const lastNameComparison =
                                        lastNameA.localeCompare(lastNameB);

                                    if (lastNameComparison !== 0)
                                        return lastNameComparison;

                                    const firstNameA =
                                        a.personal_information?.first_name ||
                                        "";
                                    const firstNameB =
                                        b.personal_information?.first_name ||
                                        "";

                                    return firstNameA.localeCompare(firstNameB);
                                })
                                .map((employee) => (
                                    <option
                                        key={employee.id}
                                        value={employee.id}
                                    >
                                        {
                                            employee.personal_information
                                                ?.last_name
                                        }
                                        ,{" "}
                                        {
                                            employee.personal_information
                                                ?.first_name
                                        }{" "}
                                        - {employee.employee_id}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {selectedEmployee && (
                        <>
                            <div className="border rounded-lg p-5 bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold">
                                        {
                                            selectedEmployee
                                                .personal_information
                                                ?.first_name?.[0]
                                        }
                                        {
                                            selectedEmployee
                                                .personal_information
                                                ?.last_name?.[0]
                                        }
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {
                                                selectedEmployee
                                                    .personal_information
                                                    ?.first_name
                                            }{" "}
                                            {
                                                selectedEmployee
                                                    .personal_information
                                                    ?.last_name
                                            }
                                        </h3>

                                        <p className="text-gray-500">
                                            {selectedEmployee?.account ??
                                                selectedEmployee?.department
                                                    ?.name}
                                        </p>

                                        <p className="text-gray-500">
                                            {selectedEmployee?.position}
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
