import React, { useMemo, useState } from "react";
import { Download, Filter } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Select from "@/app/_components/select";

export default function TimeSheetSection() {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [dateRange, setDateRange] = useState({
        startDate: "",
        endDate: "",
    });
    const [status, setStatus] = useState("");

    const dispatch = useDispatch();

    const { employees, employeesLoading } = useSelector(
        (store) => store.human_resources,
    );

    // Make sure employees is always an array
    const employeeList = Array.isArray(employees)
        ? employees
        : (employees?.data ?? []);

    // Sort employees by Last Name, then First Name
    const sortedEmployeeOptions = useMemo(() => {
        const options = employeeList
            .slice()
            .sort((a, b) => {
                const lastNameA = a.personal_information?.last_name || "";
                const lastNameB = b.personal_information?.last_name || "";

                const lastNameComparison = lastNameA.localeCompare(lastNameB);

                if (lastNameComparison !== 0) {
                    return lastNameComparison;
                }

                const firstNameA = a.personal_information?.first_name || "";
                const firstNameB = b.personal_information?.first_name || "";

                return firstNameA.localeCompare(firstNameB);
            })
            .map((employee) => ({
                value: employee.employee_id,
                label: `${employee.personal_information?.last_name ?? ""}, ${
                    employee.personal_information?.first_name ?? ""
                } - ${employee.employee_id}`,
            }));

        return [
            {
                value: "",
                label: "All Employees",
            },
            ...options,
        ];
    }, [employeeList]);

    // Find currently selected employee
    const selectedEmployee = employeeList.find(
        (employee) =>
            String(employee.employee_id) === String(selectedEmployeeId),
    );

    const summary = [
        { title: "Working Days", value: 22 },
        { title: "Present", value: 20 },
        { title: "Late", value: 2 },
        { title: "Overtime", value: "14.5 hrs" },
    ];

    const data = [
        {
            employee_id: "EMP001",
            employee: "Juan Dela Cruz",
            date: "July 20, 2026",
            in: "8:01 AM",
            breakOut: "12:00 PM",
            breakIn: "1:00 PM",
            out: "5:03 PM",
            hours: "8.0",
            status: "Present",
        },
        {
            employee_id: "EMP002",
            employee: "Maria Santos",
            date: "July 20, 2026",
            in: "8:15 AM",
            breakOut: "12:03 PM",
            breakIn: "1:02 PM",
            out: "5:00 PM",
            hours: "7.7",
            status: "Late",
        },
    ];

    // Filter timesheet data based on selected employee
    const filteredData = data.filter((row) => {
        const employeeMatch =
            !selectedEmployeeId ||
            String(row.employee_id) === String(selectedEmployeeId);

        const statusMatch = !status || row.status === status;

        return employeeMatch && statusMatch;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Time Sheets</h1>

                <p className="text-gray-500">
                    View and manage employee attendance records.
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white border rounded-xl p-4">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Employee */}
                    <div className="flex-1 min-w-[260px]">
                        <Select
                            label="Select Employee"
                            name="employee_id"
                            options={sortedEmployeeOptions}
                            value={selectedEmployeeId}
                            onChange={(value) => {
                                setSelectedEmployeeId(value);
                            }}
                            disabled={employeesLoading}
                        />
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={dateRange.startDate}
                            onChange={(e) =>
                                setDateRange({
                                    ...dateRange,
                                    startDate: e.target.value,
                                })
                            }
                            className="h-11 px-3 border rounded-lg"
                        />

                        <span className="text-gray-500">to</span>

                        <input
                            type="date"
                            value={dateRange.endDate}
                            min={dateRange.startDate}
                            onChange={(e) =>
                                setDateRange({
                                    ...dateRange,
                                    endDate: e.target.value,
                                })
                            }
                            className="h-11 px-3 border rounded-lg"
                        />
                    </div>

                    {/* Status */}
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="h-11 min-w-[170px] px-3 border rounded-lg"
                    >
                        <option value="">All Status</option>
                        <option value="Present">Present</option>
                        <option value="Late">Late</option>
                        <option value="Absent">Absent</option>
                    </select>

                    {/* Filter */}
                    <button
                        type="button"
                        className="h-11 px-6 border rounded-lg flex items-center gap-2"
                    >
                        <Filter size={18} />
                        Filter
                    </button>

                    {/* Export */}
                    <button
                        type="button"
                        className="h-11 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2"
                    >
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            {/* Selected Employee */}
            {selectedEmployee && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Selected Employee</p>

                    <p className="font-semibold text-indigo-700">
                        {selectedEmployee.personal_information?.last_name},{" "}
                        {selectedEmployee.personal_information?.first_name}
                    </p>

                    <p className="text-sm text-gray-500">
                        Employee ID: {selectedEmployee.employee_id}
                    </p>
                </div>
            )}

            {/* Summary */}
            <div className="grid md:grid-cols-4 gap-4">
                {summary.map((item) => (
                    <div
                        key={item.title}
                        className="bg-white border rounded-xl p-5"
                    >
                        <p className="text-sm text-gray-500">{item.title}</p>

                        <h2 className="text-3xl font-bold mt-2">
                            {item.value}
                        </h2>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-3 text-left">
                                    Employee
                                </th>
                                <th className="px-5 py-3 text-left">Date</th>
                                <th className="px-5 py-3 text-left">Time In</th>
                                <th className="px-5 py-3 text-left">
                                    Break Out
                                </th>
                                <th className="px-5 py-3 text-left">
                                    Break In
                                </th>
                                <th className="px-5 py-3 text-left">
                                    Time Out
                                </th>
                                <th className="px-5 py-3 text-left">Hours</th>
                                <th className="px-5 py-3 text-left">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((row, index) => (
                                    <tr
                                        key={index}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="px-5 py-4">
                                            {row.employee}
                                        </td>

                                        <td className="px-5 py-4">
                                            {row.date}
                                        </td>

                                        <td className="px-5 py-4">{row.in}</td>

                                        <td className="px-5 py-4">
                                            {row.breakOut}
                                        </td>

                                        <td className="px-5 py-4">
                                            {row.breakIn}
                                        </td>

                                        <td className="px-5 py-4">{row.out}</td>

                                        <td className="px-5 py-4">
                                            {row.hours}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    row.status === "Present"
                                                        ? "bg-green-100 text-green-700"
                                                        : row.status === "Late"
                                                          ? "bg-yellow-100 text-yellow-700"
                                                          : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="px-5 py-10 text-center text-gray-500"
                                    >
                                        No attendance records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
