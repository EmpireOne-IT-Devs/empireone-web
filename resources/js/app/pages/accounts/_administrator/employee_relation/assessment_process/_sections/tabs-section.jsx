import { Link } from "@inertiajs/react";
import React from "react";

export default function TabsSection() {
    // Relying on the URL path to determine the active tab
    const currentPath = window.location.pathname.split("/")[5];

    const tabs = [
          {
            label: "Mid Regularization",
            path: "/accounts/administrator/employee_relation/assessment_process/mid_regularization?status=Mid-Probationary",
            active: currentPath === "mid_regularization",
        },
        {
            label: "Regularization",
            path: "/accounts/administrator/employee_relation/assessment_process/regularization?status=Regular",
            active: currentPath === "regularization",
        },
        {
            label: "Extended Regularization",
            path: "/accounts/administrator/employee_relation/assessment_process/extended_regularization?status=Extended Probationary",
            active: currentPath === "extended_regularization",
        },
        {
            label: "None Regularization",
            path: "/accounts/administrator/employee_relation/assessment_process/none_regularization?status=End of Contract",
            active: currentPath === "none_regularization",
        },
    ];

    return (
        <div className="w-full  my-8">
            {/* Modern Pill-Style Tab Navigation using standard links */}
            <div className="bg-gray-100/80 p-1.5 rounded-xl inline-flex shadow-inner border border-gray-200 w-full overflow-x-auto">
                <nav className="flex space-x-1 w-full" aria-label="Tabs">
                    {tabs.map((tab, index) => (
                        <Link
                            key={index}
                            href={tab.path}
                            className={`
                                relative flex-1 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ease-out outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 text-center whitespace-nowrap block
                                ${
                                    tab.active
                                        ? "bg-white text-blue-700 shadow-sm border border-gray-200/50 scale-100"
                                        : "text-gray-800 hover:text-gray-800 hover:bg-gray-200/50 scale-95 hover:scale-100"
                                }
                            `}
                            aria-current={tab.active ? "page" : undefined}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}
