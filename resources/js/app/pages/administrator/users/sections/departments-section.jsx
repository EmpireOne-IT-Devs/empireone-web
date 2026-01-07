import React from "react";

export default function DepartmentsSection() {
    const departments = [
        {
            id: 1,
            name: "Information Technology",
            description: "Manages IT infrastructure and software development",
            userCount: 15,
            color: "bg-blue-100 text-blue-800 border-blue-200"
        },
        {
            id: 2,
            name: "Human Resources",
            description: "Handles recruitment, employee relations, and HR policies",
            userCount: 8,
            color: "bg-green-100 text-green-800 border-green-200"
        },
        {
            id: 3,
            name: "Finance",
            description: "Manages financial operations and accounting",
            userCount: 6,
            color: "bg-purple-100 text-purple-800 border-purple-200"
        },
        {
            id: 4,
            name: "Operations",
            description: "Oversees daily business operations and logistics",
            userCount: 12,
            color: "bg-orange-100 text-orange-800 border-orange-200"
        },
        {
            id: 5,
            name: "Marketing",
            description: "Handles marketing campaigns and brand management",
            userCount: 9,
            color: "bg-pink-100 text-pink-800 border-pink-200"
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Departments</h3>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                    Add Department
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((department) => (
                    <div
                        key={department.id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                    {department.name}
                                </h4>
                                <p className="text-sm text-gray-600 mb-4">
                                    {department.description}
                                </p>
                                <div className="flex items-center space-x-4">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${department.color}`}
                                    >
                                        {department.userCount} Users
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </button>
                                <button className="text-gray-400 hover:text-red-600">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                View Users →
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <h4 className="font-medium text-gray-900">Department Management</h4>
                </div>
                <p className="text-sm text-gray-600">
                    Departments organize users into functional groups. Each department can have multiple roles and access levels.
                    Users can be assigned to departments to control their permissions and ticket visibility.
                </p>
            </div>
        </div>
    );
}
