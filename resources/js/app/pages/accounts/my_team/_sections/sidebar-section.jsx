import React, { useState } from 'react';
import { Link } from "@inertiajs/react";
import { FcPieChart, FcFolder, FcConferenceCall, FcSettings, FcMindMap, FcVoicePresentation } from 'react-icons/fc';

const SidebarSection = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Dashboard');

    const currentPath = window.location.pathname.split("/")[4] ?? "dashboard";
    const menuItems = [
        {
            name: 'Dashboard',
            icon: <FcPieChart className="w-6 h-6" />,
            path: "/accounts/administrator/my_team",
            active: currentPath === "dashboard",
        },
        {
            name: 'My Team',
            icon: <FcConferenceCall className="w-6 h-6" />,
            path: "/accounts/administrator/my_team/team",
            active: currentPath === "team",
        },
        {
            name: 'Corrective Action',
            icon: <FcVoicePresentation className="w-6 h-6" />,
        },
        {
            name: 'Assessment Process',
            icon: <FcFolder className="w-6 h-6" />,
            path: "/accounts/administrator/my_team/assessment_process",
            active: currentPath === "assessment_process",
        },
    ];

    return (
        <>

            <header className="md:hidden flex flex-col w-full bg-white border-b border-gray-200 relative">
                <div className="flex items-center justify-between p-4 bg-white relative">
                    {/* Mobile Logo */}
                    <div className="flex items-center gap-x-3">
                        <div className="bg-indigo-50 rounded-lg p-2">
                            <FcMindMap className="w-6 h-6" />
                        </div>
                        <h1 className="text-gray-800 font-bold text-xl">SaaS App</h1>
                    </div>

                    {/* Hamburger Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors focus:outline-none"
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                <div
                    className={`absolute top-full left-0 w-full bg-white shadow-xl transition-all duration-300 ease-in-out overflow-hidden  ${isMobileMenuOpen ? 'max-h-[500px] border-b border-gray-200 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <ul className="flex flex-col px-4 py-2 space-y-1">
                        {menuItems.map((item, index) => (
                            <Link

                                href={item.path}
                                key={index}
                                onClick={() => {
                                    setActiveTab(item.name);
                                    setIsMobileMenuOpen(false); // Close menu on selection
                                }}
                                className={`flex items-center gap-x-4 p-3 rounded-md cursor-pointer transition-colors duration-200 ${item.active
                                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                    : 'text-gray-600 hover:bg-gray-100 font-medium'
                                    }`}
                            >
                                <div className="flex-shrink-0">{item.icon}</div>
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </ul>
                </div>
            </header>

            {/* ================================== */}
            {/* DESKTOP SIDEBAR (Hidden on mobile) */}
            {/* ================================== */}
            <aside
                className={`hidden md:block bg-white h-screen p-5 pt-8 relative transition-all duration-300 border-r border-gray-200 shadow-sm flex-shrink-0 ${isSidebarOpen ? 'w-72' : 'w-20'
                    }`}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-3 top-9 bg-white rounded-full p-1 text-gray-500 border border-gray-200 shadow-sm hover:text-indigo-600 hover:border-indigo-100 transition-colors "
                >
                    <svg
                        className={`w-4 h-4 transition-transform duration-300 ${!isSidebarOpen && 'rotate-180'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Logo Section */}
                <div className="flex items-center gap-x-4 mb-10 overflow-hidden">
                    <div className="cursor-pointer bg-indigo-50 rounded-lg p-2 flex-shrink-0">
                        <FcMindMap className="w-6 h-6" />
                    </div>
                    <h1
                        className={`text-gray-800 font-bold text-xl origin-left transition-all duration-300 whitespace-nowrap ${!isSidebarOpen && 'scale-0 opacity-0 w-0'
                            }`}
                    >
                        SaaS App
                    </h1>
                </div>

                {/* Navigation Links */}
                <ul className="space-y-2 relative">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.path}
                            onClick={() => setActiveTab(item.name)}
                            className={`flex items-center gap-x-4 p-3 rounded-md cursor-pointer transition-colors duration-200 group ${item.active
                                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium'
                                }`}
                        >
                            <div className="flex-shrink-0">
                                {item.icon}
                            </div>

                            <span
                                className={`origin-left transition-all duration-300 whitespace-nowrap ${!isSidebarOpen ? 'scale-0 opacity-0 w-0' : 'w-auto'
                                    }`}
                            >
                                {item.name}
                            </span>

                            {/* Tooltip for collapsed state */}
                            {!isSidebarOpen && (
                                <div className="absolute left-16 bg-gray-800 text-white px-3 py-1.5 rounded-md text-sm whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity  shadow-lg">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    ))}
                </ul>

            </aside>



        </>
    );
};

export default SidebarSection;