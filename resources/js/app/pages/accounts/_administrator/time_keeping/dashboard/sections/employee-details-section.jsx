import React from "react";
import {
    User,
    BadgeCheck,
    Building2,
    Briefcase,
    Calendar,
    Clock3,
} from "lucide-react";
import { useSelector } from "react-redux";

export default function EmployeeDetailsSection() {
    const { data } = useSelector((store) => store.app);

    console.log("dataadad", data);
    // Temporary data
    const employee = {
        id: "EMP-000123",
        name: "Juan Dela Cruz",
        department: "Information Technology",
        position: "Software Developer",
        schedule: "Monday - Friday | 8:00 AM - 5:00 PM",
        status: "Active",
    };

    const summary = [
        {
            title: "Present",
            value: 20,
            color: "bg-green-500",
        },
        {
            title: "Late",
            value: 2,
            color: "bg-yellow-500",
        },
        {
            title: "Absent",
            value: 1,
            color: "bg-red-500",
        },
        {
            title: "Leave",
            value: 1,
            color: "bg-blue-500",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Employee Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="h-10 w-10 text-indigo-600" />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {data?.user?.personal_information?.first_name}{" "}
                                {data?.user?.personal_information?.last_name}
                            </h2>

                            <p className="text-gray-500">
                                Employee ID:{" "}
                                <span className="font-medium">
                                    {data?.user?.account_employee?.employee_id}
                                </span>
                            </p>

                            <div className="flex flex-wrap gap-5 mt-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Building2 size={16} />
                                    {
                                        data?.user?.account_employee?.department
                                            ?.name
                                    }
                                </div>

                                <div className="flex items-center gap-2">
                                    <Briefcase size={16} />
                                    {data?.user?.account_employee?.position}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Clock3 size={16} />
                                    {/* {data?.user?.personal_information?.schedule} */}
                                    Monday - Friday | 8:00 AM - 5:00 PM
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium">
                            {/* {data?.user?.personal_information?.status} */}
                            Active
                        </span>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {summary.map((item) => (
                    <div
                        key={item.title}
                        className="bg-white border rounded-xl shadow-sm p-5"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-gray-500 text-sm">
                                    {item.title}
                                </p>

                                <h2 className="text-3xl font-bold mt-2">
                                    {item.value}
                                </h2>
                            </div>

                            <div
                                className={`w-4 h-12 rounded-full ${item.color}`}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Attendance History */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <h2 className="font-semibold text-lg">Recent Attendance</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left">Date</th>
                                <th className="px-6 py-3 text-left">Time In</th>
                                <th className="px-6 py-3 text-left">
                                    Time Out
                                </th>
                                <th className="px-6 py-3 text-left">Hours</th>
                                <th className="px-6 py-3 text-left">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {[
                                {
                                    date: "July 20, 2026",
                                    in: "8:01 AM",
                                    out: "5:03 PM",
                                    hrs: "8.0",
                                    status: "Present",
                                },
                                {
                                    date: "July 19, 2026",
                                    in: "8:17 AM",
                                    out: "5:05 PM",
                                    hrs: "7.8",
                                    status: "Late",
                                },
                                {
                                    date: "July 18, 2026",
                                    in: "-",
                                    out: "-",
                                    hrs: "0",
                                    status: "Absent",
                                },
                            ].map((row, index) => (
                                <tr
                                    key={index}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4">{row.date}</td>
                                    <td className="px-6 py-4">{row.in}</td>
                                    <td className="px-6 py-4">{row.out}</td>
                                    <td className="px-6 py-4">{row.hrs}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium
                                                ${
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
