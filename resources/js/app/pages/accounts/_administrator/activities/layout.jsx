import React from "react";
import HeaderSection from "./_section/header-section";
import TabsSection from "./_section/tabs-section";

export default function ActivitiesLayout({ children }) {
    return (
        // h-[calc(100vh-7rem)]: 4rem topbar (h-16) + 1.5rem top + 1.5rem bottom from accounts main p-6
        <div className="flex flex-col h-[calc(100vh-7rem)]">
            <div className="shrink-0 bg-gray-100">
                <HeaderSection />
                <TabsSection />
            </div>
            <div className="flex-1 min-h-0 overflow-hidden pt-3">
                {children}
            </div>
        </div>
    );
}
