import React from "react";
import HeaderSection from "./_sections/header-section";
import AddMemberSection from "./_sections/add-member-section";
import TabsSection from "./_sections/tabs-section";

export default function MyTeamLayout({ children }) {
    return (
        <>
            <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <HeaderSection />
                    </div>
                    {/* <div>
                        <AddMemberSection />
                    </div> */}
                </div>
                <TabsSection />
                {children}
            </div>
        </>
    );
}
