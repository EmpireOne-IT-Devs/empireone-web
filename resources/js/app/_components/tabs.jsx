import { router } from "@inertiajs/react";
import React from "react";

export default function Tabs({ tabs, activeIndex, onTabClick, children }) {
    return (
        <div className="border-b bg-white px-4 sm:px-6 lg:px-8">
            <nav className="flex justify-start space-x-12">
                {tabs.map((tab, idx) => (
                    <button
                        key={idx}
                        className={`py-4 text-base font-medium transition-colors ${
                            tab.active
                                ? "text-blue-800"
                                : "text-gray-600 hover:text-blue-700"
                        } relative`}
                        onClick={() => router.visit(tab.path)}
                    >
                        {tab.label}
                        {tab.active && (
                            <span className="absolute left-0 right-0 -bottom-px mx-auto h-0.5 w-4/3 bg-blue-800 rounded z-10"></span>
                        )}
                    </button>
                ))}
            </nav>
            {children}
        </div>
    );
}

// To call:
// const tabList = ["Dashboard", "Attendance", "Timesheets", "Reports"];
// const [active, setActive] = useState(1);

//  <Tab
//     tabs={tabList}
//     activeIndex={active}
//     onTabClick={setActive}
// />
