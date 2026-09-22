import React from "react";
import HRTabsSection from "./_section/tabs-section";
import HeaderSection from "./_section/header-section";

export default function EmployeeRelationLayout({ children }) {
    return (
        <>
            <div className="flex flex-col md:flex-row h-[93vh] bg-gray-50 overflow-hidden w-full">
                <HRTabsSection />
                <div className="p-3 overflow-auto w-full">
                    <div className="mb-2">
                        <HeaderSection />
                    </div>
                    {children}
                </div>
            </div>

        </>
    );
}
