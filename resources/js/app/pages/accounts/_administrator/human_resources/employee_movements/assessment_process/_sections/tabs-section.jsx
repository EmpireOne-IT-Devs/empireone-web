import { Link } from "@inertiajs/react";
import React from "react";

export default function TabsSection() {
    // const currentParams = new URLSearchParams(window.location.search);
    // const currentPath = currentParams.get("status");
    const currentPath = window.location.pathname.split('/')[6] ?? 'regular'
    const tabs = [
        {
            label: "Regularization",
            path: "/accounts/administrator/human_resources/employee_movements/assessment_process?status=Regular",
            active: currentPath === "regular",
        },
        {
            label: "Promotions & Transfer",
            path: "/accounts/administrator/human_resources/employee_movements/assessment_process/promotions",
            active: currentPath === "promotions",
        },
        // {
        //     label: "Transfers",
        //     path: "/accounts/administrator/human_resources/employee_movements/assessment_process/transfers",
        //     active: currentPath === "transfers",
        // },
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
                                ${tab.active
                                    ? "bg-purple-500 text-white shadow-sm border border-gray-200/50 scale-100"
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
