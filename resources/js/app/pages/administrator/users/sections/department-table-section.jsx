import React, { useState, useEffect } from "react";
import AddDepartmentSection from "./add-department-section";
import AddUserSection from "./add-user-section";

export default function DepartmentTableSection() {
    const [departments, setDepartments] = useState([]);
    const [departmentUsers, setDepartmentUsers] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState({});
    const [error, setError] = useState(null);

    // Fetch departments from API
    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/departments", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    // Add any authentication headers here if needed
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch departments");
            }

            const data = await response.json();
            setDepartments(data);

            // Initialize expanded state for all departments
            const expandedState = {};
            data.forEach((dept) => {
                expandedState[dept.id] = false; // Start with departments collapsed
            });
            setExpandedDepartments(expandedState);

            // Don't fetch users immediately - wait for user to expand department
        } catch (error) {
            console.error("Error fetching departments:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartmentUsers = async (departmentId) => {
        try {
            setLoadingUsers(prev => ({...prev, [departmentId]: true}));
            
            const response = await fetch(`/api/departments/${departmentId}/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch users for department ${departmentId}`);
            }

            const users = await response.json();
            setDepartmentUsers(prev => ({
                ...prev,
                [departmentId]: users
            }));
        } catch (error) {
            console.error(`Error fetching users for department ${departmentId}:`, error);
        } finally {
            setLoadingUsers(prev => ({...prev, [departmentId]: false}));
        }
    };

    const [expandedDepartments, setExpandedDepartments] = useState({});

    const toggleDepartment = (departmentId) => {
        const isCurrentlyExpanded = expandedDepartments[departmentId];
        
        setExpandedDepartments((prev) => ({
            ...prev,
            [departmentId]: !prev[departmentId],
        }));

        // If department is being expanded and users haven't been fetched yet, fetch them
        if (!isCurrentlyExpanded && !departmentUsers[departmentId]) {
            fetchDepartmentUsers(departmentId);
        }
    };

    // Function to refresh users for a specific department
    const refreshDepartmentUsers = (departmentId) => {
        fetchDepartmentUsers(departmentId);
    };

    // Function to refresh all departments (useful after adding/deleting departments)
    const refreshDepartments = () => {
        fetchDepartments();
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
                            Manage departments and users across your
                            organization
                        </h3>
                        <AddDepartmentSection />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">
                            Loading departments...
                        </p>
                    </div>
                </div>
            ) : error ? (
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 text-center">
                        <div className="text-red-600 mb-2">
                            <svg
                                className="h-8 w-8 mx-auto"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                        </div>
                        <p className="text-red-600 font-medium">
                            Error loading departments
                        </p>
                        <p className="text-gray-600 text-sm">{error}</p>
                        <button
                            onClick={fetchDepartments}
                            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            ) : (
                departments.map((department) => (
                    <div
                        key={department.id}
                        className="bg-white rounded-lg shadow"
                    >
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
                                                expandedDepartments[
                                                    department.id
                                                ]
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
                                            {departmentUsers[department.id]?.length || department.userCount || 0} users)
                                        </span>
                                    </button>
                                </div>
                                <div className="ml-auto flex space-x-2">
                                    <AddUserSection 
                                        data={department} 
                                        onUserAdded={() => refreshDepartmentUsers(department.id)}
                                    />
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
                                {loadingUsers[department.id] ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                                        <p className="mt-2 text-sm text-gray-600">Loading users...</p>
                                    </div>
                                ) : departmentUsers[department.id]?.length > 0 ? (
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
                                                {departmentUsers[department.id].map((user) => (
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
                                                                    user.role,
                                                                )}`}
                                                            >
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleTypeColor(
                                                                    user.roleType,
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
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-gray-400 mb-2">
                                            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500 text-sm">No users found in this department</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
