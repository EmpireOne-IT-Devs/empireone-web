import { router } from "@inertiajs/react";
import React from "react";

export default function BackSection() {
    // Default back action if no prop is passed
    const handleBack = () => {
        router.visit(
            `/accounts/administrator/employee_relation/leads`,
        );
    };

    return (
        <div className="flex items-center w-full px-6 ">
            <button
                onClick={handleBack}
                aria-label="Go back"
                className="
          group flex items-center gap-2 px-4 py-2 
          text-[15px] font-semibold text-blue-600 
          bg-transparent border  rounded-lg 
          transition-all duration-200 ease-out 
          hover:bg-gray-100 border-blue-600 hover:shadow-sm 
          active:scale-95 
          outline-none focus-visible:ring-2 focus-visible:ring-gray-300
        "
            >
                <svg
                    className="transition-transform duration-200 ease-out group-hover:-translate-x-1"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>Back</span>
            </button>
        </div>
    );
}
