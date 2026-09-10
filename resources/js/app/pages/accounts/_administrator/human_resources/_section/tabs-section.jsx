import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import HeaderSection from "./header-section";

export default function HRModuleLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Safeguard for SSR if applicable, otherwise behaves normally
    const currentPath = typeof window !== "undefined" ? window.location.pathname.split("/")[4] : "";

    const tabs = [
        {
            label: "Employees",
            path: "/accounts/administrator/human_resources/employees",
            active: currentPath === "employees",
        },
        {
            label: "Executives/Managers/Leaders",
            path: "/accounts/administrator/human_resources/leads",
            active: currentPath === "leads",
        },
        {
            label: "Acknowledgements",
            path: "/accounts/administrator/human_resources/acknowledgements",
            active: currentPath === "acknowledgements",
        },
        {
            label: "Pooling",
            path: "/accounts/administrator/human_resources/pooling",
            active: currentPath === "pooling",
        },
        {
            label: "Employee Movements",
            path: "/accounts/administrator/human_resources/employee_movements?status=Regular",
            active: currentPath === "employee_movements",
        },
        {
            label: "Disciplinary Records",
            path: "/accounts/administrator/human_resources/disciplinary_records",
            active: currentPath === "disciplinary_records",
        },
        {
            label: "Separation",
            path: "/accounts/administrator/human_resources/separation",
            active: currentPath === "separation",
        },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex max-h-[78vh] font-sans relative">

            {/* Mobile Toggle Button: Added z-30 so it sits above content */}
            <div className="absolute top-2 left-4 z-30 md:hidden">
                <button
                    onClick={toggleSidebar}
                    className="rounded-md bg-purple-600 p-2 text-sm text-white shadow-md"
                >
                    {isSidebarOpen ? "Close Menu" : "HR Menu"}
                </button>
            </div>

            {/* Mobile Overlay: Added z-40 to completely cover the background content */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Card: 
                - Mobile: flush to edges (inset-y-0 left-0), highest z-index (z-50)
                - Desktop: floating card design retained (md:m-4 md:rounded-md) 
            */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 h-full w-64 transform overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ease-in-out 
                md:relative md:top-0 md:left-0 md:z-auto md:m-4 md:block md:translate-x-0 md:rounded-md md:border md:border-gray-200 md:shadow-sm
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="border-b border-gray-100 p-5 text-center">
                    <h2 className="text-lg font-semibold text-gray-800">HR Module</h2>
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

            {/* Main Content Area: Added pt-14 on mobile to prevent the absolute button from covering content */}
            <main className="flex-1 w-full pt-14 md:pt-0">

                <HeaderSection />
                <div className="rounded-md shadow-sm h-full overflow-auto md:pr-4 ">
                    {children}
                </div>
            </main>
        </div>
    );
}