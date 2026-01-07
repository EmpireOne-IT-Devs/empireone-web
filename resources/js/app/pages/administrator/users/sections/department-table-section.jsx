import React, { useState } from "react";

export default function DepartmentTableSection() {
    const [departments, setDepartments] = useState([
        {
            id: 1,
            name: "Information Technology",
            userCount: 6,
            users: [
                {
                    id: 1,
                    fullName: "John Doe",
                    email: "employee@company.com",
                    jobPosition: "Senior Developer",
                    site: "Manila HQ",
                    role: "Developer",
                    roleType: "Employee",
                },
                {
                    id: 2,
                    fullName: "Sarah Chen",
                    email: "lead@company.com",
                    jobPosition: "IT Team Lead",
                    site: "Manila HQ",
                    role: "Team Lead",
                    roleType: "Lead",
                },
                {
                    id: 3,
                    fullName: "Jane Smith",
                    email: "manager@company.com",
                    jobPosition: "IT Manager",
                    site: "Manila HQ",
                    role: "Manager",
                    roleType: "Manager",
                },
                {
                    id: 4,
                    fullName: "Robert Wilson",
                    email: "employee2@company.com",
                    jobPosition: "Junior Developer",
                    site: "Manila HQ",
                    role: "Developer",
                    roleType: "Employee",
                },
                {
                    id: 5,
                    fullName: "Alex Johnson",
                    email: "it.support@company.com",
                    jobPosition: "IT Support Specialist",
                    site: "Manila HQ",
                    role: "IT Support",
                    roleType: "IT Support",
                },
                {
                    id: 6,
                    fullName: "Chris Martinez",
                    email: "it.support2@company.com",
                    jobPosition: "IT Support Technician",
                    site: "Cebu Branch",
                    role: "IT Support",
                    roleType: "IT Support",
                },
            ],
        },
        {
            id: 2,
            name: "Human Resources",
            userCount: 3,
            users: [
                {
                    id: 7,
                    fullName: "Mike Johnson",
                    email: "hr.lead@company.com",
                    jobPosition: "HR Lead",
                    site: "Cebu Branch",
                    role: "HR Lead",
                    roleType: "Lead",
                },
            ],
        },
    ]);

    const [expandedDepartments, setExpandedDepartments] = useState({
        1: true,
        2: true
    });

    const toggleDepartment = (departmentId) => {
        setExpandedDepartments((prev) => ({
            ...prev,
            [departmentId]: !prev[departmentId],
        }));
    };

    const getRoleTypeColor = (roleType) => {
        switch (roleType) {
            case "Employee":
                return "bg-green-100 text-green-800";
            case "Lead":
                return "bg-yellow-100 text-yellow-800";
            case "Manager":
                return "bg-purple-100 text-purple-800";
            case "IT Support":
                return "bg-teal-100 text-teal-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case "Developer":
                return "bg-blue-100 text-blue-800";
            case "Team Lead":
                return "bg-blue-100 text-blue-800";
            case "Manager":
                return "bg-purple-100 text-purple-800";
            case "IT Support":
                return "bg-blue-100 text-blue-800";
            case "HR Lead":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                            Manage departments and users across your organization
                        </h3>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                            <span className="text-xl">+</span>
                            <span>Add Department</span>
                        </button>
                    </div>
                </div>
            </div>

            {departments.map((department) => (
                <div key={department.id} className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between space-x-3">
                            <div className="flex-shrink-0">
                                <button
                                    onClick={() =>
                                        toggleDepartment(department.id)
                                    }
                                    className="flex items-center space-x-2 text-left"
                                >
                                    <svg
                                        className={`h-5 w-5 transform transition-transform ${
                                            expandedDepartments[department.id]
                                                ? "rotate-90"
                                                : ""
                                        }`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                    <svg
                                        className="h-5 w-5 text-gray-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        />
                                    </svg>
                                    <span className="font-medium text-gray-900">
                                        {department.name} (
                                        {department.userCount} users)
                                    </span>
                                </button>
                            </div>
                            <div className="ml-auto flex space-x-2">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm flex items-center space-x-1">
                                    <span className="text-lg">+</span>
                                    <span>Add User</span>
                                </button>
                                <button className="text-red-500 hover:text-red-700">
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {expandedDepartments[department.id] && (
                        <div className="px-6 pb-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Full Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Job Position
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Site
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {department.users.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {user.fullName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.jobPosition}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {user.site}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                                                            user.role
                                                        )}`}
                                                    >
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleTypeColor(
                                                            user.roleType
                                                        )}`}
                                                    >
                                                        {user.roleType}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex space-x-2">
                                                        <button className="text-blue-600 hover:text-blue-900">
                                                            <svg
                                                                className="h-5 w-5"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                                />
                                                            </svg>
                                                        </button>
                                                        <button className="text-red-600 hover:text-red-900">
                                                            <svg
                                                                className="h-5 w-5"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
