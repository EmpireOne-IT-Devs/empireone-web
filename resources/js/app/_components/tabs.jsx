import { Link } from "@inertiajs/react";
import React from "react";

export default function Tabs({ tabs, children }) {
    return (
        <div className="border-b px-4 sm:px-6 lg:px-8">
            {/* Added horizontal scroll for mobile screens to prevent squishing */}
            <nav className="flex justify-start space-x-8 sm:space-x-12  whitespace-nowrap no-scrollbar">
                {tabs.map((tab, idx) => (
                    <Link
                        key={idx}
                        href={tab.path}
                        className={`py-4 text-base font-medium transition-colors relative outline-none ${
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
            {children}
        </div>
    );
}