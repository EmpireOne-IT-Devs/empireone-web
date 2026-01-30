import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { FaUser, FaClock, FaTicketAlt, FaChartBar } from 'react-icons/fa';

const Page = () => {
    const { auth } = usePage().props;
    
    return (
        <>
            <Head title="Employee Dashboard" />
            
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white shadow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <h1 className="text-3xl font-bold text-gray-900">
                                Employee Dashboard
                            </h1>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">
                                    Welcome back, {auth.user.first_name} {auth.user.last_name}
                                </span>
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <FaUser className="text-white text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {/* Quick Stats Cards */}
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <FaClock className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Hours This Week
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    40
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <FaTicketAlt className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Open Tickets
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    3
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <FaChartBar className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Performance Score
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    85%
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <FaUser className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Role
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    Employee
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Recent Activities
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                            <div className="text-sm text-gray-600">
                                                Logged in today at 9:00 AM
                                            </div>
                                        </div>
                                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                            <div className="text-sm text-gray-600">
                                                Completed training module: Safety Guidelines
                                            </div>
                                        </div>
                                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                            <div className="text-sm text-gray-600">
                                                Submitted timesheet for last week
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Quick Actions
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                            View Profile
                                        </button>
                                        <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                            Submit Ticket
                                        </button>
                                        <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                            View Attendance
                                        </button>
                                        <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                            Training Materials
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Page;
