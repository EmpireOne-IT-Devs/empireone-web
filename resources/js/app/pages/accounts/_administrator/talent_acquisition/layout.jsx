import { Link } from "@inertiajs/react";
import React, { useState } from "react";
import HeaderSection from "./_sections/header-section";

export default function JobPostingLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Safeguard for SSR/Inertia initial load
    const path = typeof window !== "undefined" ? window.location.pathname.split("/")[4] : "";

    const tabs = [
        {
            label: "Dashboard",
            path: "/accounts/administrator/talent_acquisition/dashboard",
            active: path === "dashboard",
        },
        {
            label: "Job Postings",
            path: "/accounts/administrator/talent_acquisition/job_posting?location_id=0",
            active: path === "job_posting",
        },
        {
            label: "Applicants",
            path: "/accounts/administrator/talent_acquisition/applicants?location_type=all",
            active: path === "applicants",
        },
        {
            label: "ERP",
            path: "/accounts/administrator/talent_acquisition/erp",
            active: path === "erp",
        },
        {
            label: "Calendar",
            path: "/accounts/administrator/talent_acquisition/calendar",
            active: path === "calendar",
        },
        {
            label: "Job Requisition",
            path: "/accounts/administrator/talent_acquisition/job_requisition",
            active: path === "job_requisition",
        },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex max-h-[78vh] font-sans relative">

            {/* Mobile Toggle Button */}
            <div className="absolute top-3 left-4 z-30 md:hidden">
                <button
                    onClick={toggleSidebar}
                    className="rounded-md bg-purple-600 p-2 text-sm text-white shadow-md"
                >
                    {isSidebarOpen ? "Close Menu" : "TA Menu"}
                </button>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Card */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 h-full w-64 transform overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-in-out 
                md:relative md:top-0 md:left-0 md:z-auto md:m-4 md:block md:translate-x-0 md:rounded-md md:border md:border-gray-200 md:shadow-sm
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="border-b border-gray-100 p-5 text-center">
                    <h2 className="text-lg font-semibold text-gray-800">Talent Acquisition</h2>
                </div>

                <nav className="flex flex-col space-y-1 p-3">
                    {tabs.map((tab, index) => (
                        <Link
                            key={index}
                            href={tab.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`block px-4 py-2.5 text-sm font-medium transition-colors ${tab.active
                                    ? "rounded-md bg-purple-600 text-white shadow-sm"
                                    : "text-gray-600 hover:rounded-md hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 w-full pt-14 md:pt-0">
                <HeaderSection />
                {/* Page Content */}
                <div className="rounded-md shadow-sm h-full overflow-auto md:pr-4 ">
                    {children}
                </div>
            </main>
        </div>
    );
}