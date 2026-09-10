import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import HeaderSection from "./header-section";
import { useSelector } from "react-redux";

export default function HRModuleLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Store only the single active tab label (or null if none are explicitly expanded)
    const [openMenuLabel, setOpenMenuLabel] = useState(null);

    const { data } = useSelector((store) => store.app);

    // Safeguard for SSR
    const currentPath = typeof window !== "undefined" ? window.location.pathname.split("/")[4] : "";
    const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const currentLocationId = searchParams ? searchParams.get("location_id") : null;

    // All tabs with dynamic location children
    const tabs = [
        {
            label: "Employees",
            path: "/accounts/administrator/human_resources/employees",
            active: currentPath === "employees",
            children: data?.locations?.map((res) => ({
                label: res.name,
                path: `/accounts/administrator/human_resources/employees?location_id=${res.id}`,
                active: currentPath === "employees" && currentLocationId === String(res.id),
            }))
        },
        {
            label: "Leaders ",
            path: "/accounts/administrator/human_resources/leads",
            active: currentPath === "leads",
            children: data?.locations?.map((res) => ({
                label: res.name,
                path: `/accounts/administrator/human_resources/leads?location_id=${res.id}`,
                active: currentPath === "leads" && currentLocationId === String(res.id),
            }))
        },
        {
            label: "Employee Movements",
            path: "/accounts/administrator/human_resources/employee_movements?status=Regular",
            active: currentPath === "employee_movements",
            children: data?.locations?.map((res) => ({
                label: res.name,
                path: `/accounts/administrator/human_resources/employee_movements?status=Regular&location_id=${res.id}`,
                active: currentPath === "employee_movements" && currentLocationId === String(res.id),
            }))
        },
        {
            label: "Separation",
            path: "/accounts/administrator/human_resources/separation",
            active: currentPath === "separation",
            children: data?.locations?.map((res) => ({
                label: res.name,
                path: `/accounts/administrator/human_resources/separation?location_id=${res.id}`,
                active: currentPath === "separation" && currentLocationId === String(res.id),
            }))
        },
        {
            label: "Acknowledgements",
            path: "/accounts/administrator/human_resources/acknowledgements",
            active: currentPath === "acknowledgements",
        },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Helper to check if a menu is open
    const isMenuOpen = (tab) => {
        // If user manually clicked a menu item, respect that single selection
        if (openMenuLabel !== null) {
            return openMenuLabel === tab.label;
        }
        // Fallback default: Open the menu if its parent path or child is currently active
        return tab.active || tab.children?.some((child) => child.active);
    };

    // Auto-closes any previously opened menu and opens the newly clicked one
    const toggleSubmenu = (tab) => {
        const currentlyOpen = isMenuOpen(tab);
        if (currentlyOpen) {
            setOpenMenuLabel(""); // Close it
        } else {
            setOpenMenuLabel(tab.label); // Open this one (auto-closing others)
        }
    };

    return (
        <div className="flex min-h-[78vh] bg-gray-50 font-sans relative">

            {/* Mobile Toggle Button */}
            <div className="absolute top-3 left-4 z-30 md:hidden">
                <button
                    onClick={toggleSidebar}
                    className="rounded-md bg-purple-600 p-2 text-sm text-white shadow-md"
                >
                    {isSidebarOpen ? "Close Menu" : "HR Menu"}
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
                    <h2 className="text-lg font-semibold text-gray-800">HR Module</h2>
                </div>

                <nav className="flex flex-col space-y-1 p-3">
                    {tabs.map((tab, index) => (
                        <div key={index} className="flex flex-col">

                            {/* Parent Link Row */}
                            <div className={`flex items-center justify-between rounded-md transition-colors ${tab.active
                                    ? "bg-purple-600 text-white shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}>
                                <a
                                    onClick={() => toggleSubmenu(tab)}
                                    className="block flex-1 cursor-pointer px-4 py-2.5 text-sm font-medium"
                                >
                                    {tab.label}
                                </a>

                                {/* Caret / Toggle Button */}
                                {tab.children && tab.children.length > 0 && (
                                    <button
                                        onClick={() => toggleSubmenu(tab)}
                                        className={`pr-3 pl-2 py-2.5 focus:outline-none ${tab.active ? "text-purple-200 hover:text-white" : "text-gray-400 hover:text-gray-700"
                                            }`}
                                    >
                                        <svg
                                            className={`h-4 w-4 transform transition-transform duration-200 ${isMenuOpen(tab) ? "rotate-90" : ""
                                                }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Nested Children Links */}
                            {tab.children && tab.children.length > 0 && isMenuOpen(tab) && (
                                <div className="ml-4 mt-1 flex flex-col space-y-1 border-l-2 border-gray-100 pl-2 transition-all duration-300 ease-in-out">
                                    {tab.children.map((child, childIndex) => (
                                        <Link
                                            key={childIndex}
                                            href={child.path}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className={`block px-4 py-2 text-sm font-medium transition-colors ${child.active
                                                    ? "rounded-md bg-purple-100 text-purple-700"
                                                    : "text-gray-500 hover:rounded-md hover:bg-gray-50 hover:text-gray-900"
                                                }`}
                                        >
                                            {child.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 w-full flex flex-col pt-14 md:pt-4 md:pr-4">
                <div className="mb-2">
                    <HeaderSection />
                </div>

                <div className="rounded-md shadow-sm h-full overflow-auto bg-white border border-gray-100 p-4">
                    {children}
                </div>
            </main>
        </div>
    );
}