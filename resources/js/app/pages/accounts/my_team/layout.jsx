import React from "react";
import HeaderSection from "./_sections/header-section";
import AddMemberSection from "./_sections/add-member-section";
import TabsSection from "./_sections/tabs-section";
import SidebarSection from "./_sections/sidebar-section";

export default function MyTeamLayout({ children }) {
    return (
        <>
            {/* <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <HeaderSection />
                    </div>
                  
                </div>
                <TabsSection />
                {children}
            </div> */}
            <div className="flex flex-col md:flex-row h-[87vh] bg-gray-50 overflow-hidden w-full">
                <SidebarSection />
                <div className="p-3 overflow-auto w-full">
                    {children}
                </div>
            </div>
        </>
    );
}
