import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { FcMindMap } from "react-icons/fc";

/**
 * Reusable SubSidebar Layout Component
 * 
 * @param {Array} tabs - Array of tab objects:
 *   [{ label/name: string, icon?: ReactNode, path?: string, active?: boolean, children?: [{ label/name: string, path: string, active: boolean }] }]
 * @param {string} title - Sidebar header title (e.g. "HR Module", "TA Module")
 * @param {ReactNode} titleIcon - Header icon component (defaults to FcMindMap)
 * @param {ReactNode} children - Main content area JSX
 */
export default function SubSidebarSection({
    tabs = [],
    title = "Module",
    titleIcon = <FcMindMap className="w-6 h-6" />,
    children
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openMenuLabel, setOpenMenuLabel] = useState(null);

    // Normalize label/name access across different tab data structures
    const getTabLabel = (tab) => tab?.label || tab?.name || "";

    // Helper to check if a menu accordion should be open
    const isMenuOpen = (tab) => {
        const label = getTabLabel(tab);
        if (openMenuLabel !== null) {
            return openMenuLabel === label;
        }
        return tab.active || tab.children?.some((child) => child.active);
    };

    // Toggle submenus auto-closing other open accordions
    const toggleSubmenu = (tab) => {
        const label = getTabLabel(tab);
        const currentlyOpen = isMenuOpen(tab);
        if (currentlyOpen) {
            setOpenMenuLabel("");
        } else {
            setOpenMenuLabel(label);
            setIsSidebarOpen(true);
        }
    };

    return (
        <div className="flex max-h-[88vh] bg-gray-50 font-sans relative">

            {/* Mobile Header */}
            <header className="md:hidden flex flex-col w-full bg-white border-b border-gray-200 relative z-50">
                <div className="flex items-center justify-between p-4 bg-white relative">
                    <div className="flex items-center gap-x-3">
                        <div className="bg-indigo-50 rounded-lg p-2 shrink-0">
                            {titleIcon}
                        </div>
                        <h1 className="text-gray-800 font-bold text-[15px]">{title}</h1>
                    </div>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors duration-200 focus:outline-none"
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Dropdown Menu with Expand Transition */}
                <div
                    className={`absolute top-full left-0 w-full z-40 bg-white shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-[800px] border-b border-gray-200 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <ul className="flex flex-col px-4 py-2 space-y-1">
                        {tabs.map((tab, index) => {
                            const tabLabel = getTabLabel(tab);
                            const hasChildren = tab.children && tab.children.length > 0;
                            const expanded = isMenuOpen(tab);

                            return (
                                <div key={index} className="flex flex-col">
                                    {hasChildren ? (
                                        <button
                                            onClick={() => toggleSubmenu(tab)}
                                            className={`flex items-center justify-between w-full p-3 rounded-md transition-all duration-200 text-left focus:outline-none ${tab.active ? 'bg-[#9333ea] text-white font-medium shadow-sm' : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-x-3">
                                                {tab.icon}
                                                <span>{tabLabel}</span>
                                            </div>
                                            <svg
                                                className={`h-4 w-4 transform transition-transform duration-300 ease-in-out ${expanded ? 'rotate-90' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <Link
                                            href={tab.path || '#'}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`flex items-center gap-x-3 p-3 rounded-md transition-all duration-200 text-sm font-medium ${tab.active ? 'bg-[#9333ea] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {tab.icon}
                                            <span>{tabLabel}</span>
                                        </Link>
                                    )}

                                    {/* Mobile Submenu Accordion Transition */}
                                    {hasChildren && (
                                        <div
                                            className={`transition-all duration-300 ease-in-out overflow-hidden ${expanded ? 'max-h-96 opacity-100 mt-1 mb-1' : 'max-h-0 opacity-0'
                                                }`}
                                        >
                                            <div className="ml-9 flex flex-col space-y-1 border-l border-gray-200 pl-2">
                                                {tab.children.map((child, childIndex) => (
                                                    <Link
                                                        key={childIndex}
                                                        href={child.path}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className={`block px-3 py-2 text-xs transition-colors duration-200 ${child.active ? "text-[#9333ea] font-bold" : "text-gray-500 hover:text-gray-900"
                                                            }`}
                                                    >
                                                        {getTabLabel(child)}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </ul>
                </div>
            </header>

            {/* Desktop Sidebar */}
            <aside
                className={`hidden md:block bg-white h-screen pt-2 relative transition-all duration-300 ease-in-out border-r border-gray-200 shadow-sm flex-shrink-0 z-10 ${isSidebarOpen ? 'w-64' : 'w-20'
                    }`}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-3 top-9 bg-white rounded-full p-1 text-gray-500 border border-gray-200 shadow-sm hover:text-[#9333ea] hover:border-purple-200 transition-all duration-200 focus:outline-none z-20"
                >
                    <svg
                        className={`w-4 h-4 transform transition-transform duration-300 ease-in-out ${!isSidebarOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Header Title Section */}
                <div className="border-b border-gray-100 p-3 flex items-center justify-center gap-x-3 mb-2 overflow-hidden">
                    <div className="bg-indigo-50 rounded-lg p-2 shrink-0 transition-transform duration-300">
                        {titleIcon}
                    </div>
                    <h2
                        className={`text-gray-800 font-bold text-[15px] origin-left transition-all duration-300 ease-in-out whitespace-nowrap ${!isSidebarOpen ? 'scale-0 opacity-0 w-0' : 'opacity-100 w-auto'
                            }`}
                    >
                        {title}
                    </h2>
                </div>

                <nav className="flex flex-col space-y-1 p-3">
                    {tabs.map((tab, index) => {
                        const tabLabel = getTabLabel(tab);
                        const hasChildren = tab.children && tab.children.length > 0;
                        const expanded = isMenuOpen(tab);

                        return (
                            <div key={index} className="flex flex-col mb-1 relative group">
                                {hasChildren ? (
                                    /* Accordion Toggle Button for items with children */
                                    <button
                                        onClick={() => toggleSubmenu(tab)}
                                        className={`flex items-center justify-between w-full text-left rounded-md transition-all duration-200 cursor-pointer focus:outline-none ${tab.active
                                            ? "bg-[#9333ea] text-white shadow-sm"
                                            : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="flex items-center gap-x-3 px-4 py-3 text-sm font-medium">
                                            {tab.icon}
                                            <span className={`origin-left transition-all duration-300 ease-in-out whitespace-nowrap ${!isSidebarOpen ? 'scale-0 opacity-0 w-0' : 'opacity-100 w-auto'
                                                }`}>
                                                {tabLabel}
                                            </span>
                                        </div>

                                        {isSidebarOpen && (
                                            <div className={`pr-4 pl-2 py-3 ${tab.active ? "text-white" : "text-gray-400"}`}>
                                                <svg
                                                    className={`h-3.5 w-3.5 transform transition-transform duration-300 ease-in-out ${expanded ? "rotate-90" : ""
                                                        }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ) : (
                                    /* Direct Inertia Link for items without children */
                                    <Link
                                        href={tab.path || '#'}
                                        className={`flex items-center rounded-md transition-all duration-200 ${tab.active
                                            ? "bg-[#9333ea] text-white shadow-sm"
                                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                            }`}
                                    >
                                        <div className="flex items-center gap-x-3 px-4 py-3 text-sm font-medium">
                                            {tab.icon}
                                            <span className={`origin-left transition-all duration-300 ease-in-out whitespace-nowrap ${!isSidebarOpen ? 'scale-0 opacity-0 w-0' : 'opacity-100 w-auto'
                                                }`}>
                                                {tabLabel}
                                            </span>
                                        </div>
                                    </Link>
                                )}

                                {/* Desktop Submenu Smooth Height Transition */}
                                {hasChildren && (
                                    <div
                                        className={`transition-all duration-300 ease-in-out overflow-hidden ${expanded && isSidebarOpen
                                            ? "max-h-96 opacity-100 mt-1.5 mb-1"
                                            : "max-h-0 opacity-0"
                                            }`}
                                    >
                                        <div className="ml-9 flex flex-col space-y-1 border-l border-gray-200 pl-1.5">
                                            {tab.children.map((child, childIndex) => (
                                                <Link
                                                    key={childIndex}
                                                    href={child.path}
                                                    className={`block px-4 py-2.5 text-[13px] transition-all duration-200 ${child.active
                                                        ? "rounded-md bg-[#f3e8ff] text-[#9333ea] font-medium"
                                                        : "text-gray-500 hover:rounded-md hover:bg-gray-50 hover:text-gray-800"
                                                        }`}
                                                >
                                                    {getTabLabel(child)}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tooltip for collapsed state */}
                                {!isSidebarOpen && (
                                    <div className="absolute left-16 top-2 bg-gray-800 text-white px-3 py-1.5 rounded-md text-sm whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-50">
                                        {tabLabel}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 w-full flex flex-col pt-14 md:pt-4 md:pr-4 transition-all duration-300 ease-in-out">
                {children}
            </main>
        </div>
    );
}