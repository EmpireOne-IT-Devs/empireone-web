import React from "react";
import HeaderSection from "./_sections/header-section";
import TabsSection from "./_sections/tabs-section";

export default function EmployeeLayout({ children }) {
    return (
        <>
            <div className="min-h-screen bg-gray-50 p-8 text-slate-700 font-sans">
                {/* Top Header */}

                <HeaderSection />

                {/* Navigation Tabs */}
                <TabsSection />

                {/* Grid Layout */}
                {children}
            </div>
        </>
    );
}
