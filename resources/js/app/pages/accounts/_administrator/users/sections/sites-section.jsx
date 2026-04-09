import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_sites_service_thunk } from "@/app/redux/site-slice";
import AddSiteSection from "./add-site-section";

export default function SitesSection() {
    const dispatch = useDispatch();
    const { sites, loading, error } = useSelector((state) => state.sites);

    useEffect(() => {
        dispatch(get_sites_service_thunk());
    }, [dispatch]);

    // Helper function to get status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return "bg-green-100 text-green-600 border-green-200";
            case 'under setup':
            case 'pending':
                return "bg-yellow-100 text-yellow-600 border-yellow-200";
            case 'inactive':
            case 'closed':
                return "bg-red-100 text-red-600 border-red-200";
            default:
                return "bg-gray-100 text-gray-600 border-gray-200";
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                        Sites Management
                    </h3>
                    <AddSiteSection />
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading sites...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                        Sites Management
                    </h3>
                    <AddSiteSection />
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-sm text-red-700">
                        Error loading sites: {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                    Sites Management
                </h3>
                <AddSiteSection />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sites?.length > 0 ? (
                    sites.map((site) => (
                        <div
                            key={site.id}
                            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-gray-900 text-lg">
                                        {site.name}
                                    </h4>
                                    <div className="flex space-x-2">
                                        <button className="text-gray-400 hover:text-blue-600">
                                            <svg
                                                className="w-4 h-4"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                        </button>
                                        <button className="text-gray-400 hover:text-red-600">
                                            <svg
                                                className="w-4 h-4"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {site.address && (
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <svg
                                                className="w-4 h-4 text-gray-500"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <p className="text-sm text-gray-600">
                                                {site.address}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div className="flex items-center space-x-4">
                                        <div
                                            className={`${getStatusColor(site.status)} px-2 py-1 rounded-full text-xs font-medium`}
                                        >
                                            {site.status || "Unknown"}
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <svg
                                                className="w-4 h-4 text-gray-500"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                            </svg>
                                            <span className="text-sm text-gray-600">
                                                {site.employee_count || 0} employees
                                            </span>
                                        </div>
                                    </div>
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 text-center py-12">
                        <div className="text-gray-500">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
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
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No sites</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by creating a new site.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                    <svg
                        className="w-5 h-5 text-blue-600 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <div className="text-sm">
                        <strong className="text-blue-800">
                            Site Information:
                        </strong>
                        <span className="text-blue-700 ml-1">
                            Each site represents a physical location where
                            employees work. You can manage site-specific
                            settings, employee assignments, and operational
                            details. Sites can have different access levels and
                            department configurations.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
