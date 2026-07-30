import { Link } from "@inertiajs/react";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function Tabs({ tabs, children }) {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [dropdownLeft, setDropdownLeft] = useState(0);
    const stickyRef = useRef(null);
    const buttonRefs = useRef({});

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (stickyRef.current && !stickyRef.current.contains(e.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleToggle = (idx) => {
        if (openDropdown === idx) {
            setOpenDropdown(null);
            return;
        }
        const btn = buttonRefs.current[idx];
        if (btn && stickyRef.current) {
            const btnRect = btn.getBoundingClientRect();
            const containerRect = stickyRef.current.getBoundingClientRect();
            setDropdownLeft(btnRect.left - containerRect.left);
        }
        setOpenDropdown(idx);
    };

    const activeDropdownTab = openDropdown !== null ? tabs[openDropdown] : null;

    return (
        <div className="sticky top-0  shadow-sm relative" ref={stickyRef}>
            {/* Mobile responsive tabs with horizontal scroll */}
            <div className="overflow-x-auto px-4 sm:px-6 lg:px-8 no-scrollbar">
                <nav className="flex justify-start space-x-4 sm:space-x-8 whitespace-nowrap min-w-min">
                    {tabs.map((tab, idx) => {
                        if (tab.children) {
                            const isOpen = openDropdown === idx;
                            return (
                                <div key={idx}>
                                    <button
                                        ref={(el) => (buttonRefs.current[idx] = el)}
                                        type="button"
                                        onClick={() => handleToggle(idx)}
                                        className={`py-3 sm:py-4 px-2 sm:px-0 text-sm sm:text-base font-medium transition-colors relative outline-none flex items-center gap-1 ${
                                            tab.active
                                                ? "text-blue-800"
                                                : "text-gray-600 hover:text-blue-700"
                                        }`}
                                    >
                                        {tab.label}
                                        <ChevronDown
                                            size={14}
                                            className={`transition-transform duration-200 ${
                                                isOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                        {tab.active && (
                                            <span className="absolute left-0 right-0 -bottom-px mx-auto h-0.5 w-full bg-blue-800 rounded z-10" />
                                        )}
                                    </button>

                                </div>
                            );
                        }

                        return (
                            <Link
                                key={idx}
                                href={tab.path}
                                className={`py-3 sm:py-4 px-2 sm:px-0 text-sm sm:text-base font-medium transition-colors relative outline-none ${
                                    tab.active
                                        ? "text-blue-800"
                                        : "text-gray-600 hover:text-blue-700"
                                }`}
                            >
                                {tab.label}
                                {tab.active && (
                                    <span className="absolute left-0 right-0 -bottom-px mx-auto h-0.5 w-full bg-blue-800 rounded z-10" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Dropdown rendered here — outside overflow-x-auto so it's never clipped */}
            {activeDropdownTab?.children && (
                <div
                    className="absolute top-full mt-0 bg-white border border-gray-200 rounded-lg shadow-lg z-30 min-w-[180px]"
                    style={{ left: dropdownLeft }}
                >
                    {activeDropdownTab.children.map((child, childIdx) => (
                        <Link
                            key={childIdx}
                            href={child.path}
                            onClick={() => setOpenDropdown(null)}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 first:rounded-t-lg last:rounded-b-lg transition-colors"
                        >
                            {child.label}
                        </Link>
                    ))}
                </div>
            )}

            {children}
        </div>
    );
}