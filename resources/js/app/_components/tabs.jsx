import { Link } from "@inertiajs/react";
import React from "react";

export default function Tabs({ tabs, children }) {
    return (
        <div className=" sticky top-0 z-10 shadow-sm">
            {/* Mobile responsive tabs with horizontal scroll */}
            <div className="overflow-x-auto px-4 sm:px-6 lg:px-8 no-scrollbar">
                <nav className="flex justify-start space-x-4 sm:space-x-8 whitespace-nowrap min-w-min">
                    {tabs.map((tab, idx) => (
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
                                <span className="absolute left-0 right-0 -bottom-px mx-auto h-0.5 w-full bg-blue-800 rounded z-10"></span>
                            )}
                        </Link>
                    ))}
                </nav>
            </div>
            {children}
        </div>
    );
}