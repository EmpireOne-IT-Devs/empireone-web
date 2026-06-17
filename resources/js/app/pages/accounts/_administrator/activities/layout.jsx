import Tabs from "@/app/_components/tabs";
import { router } from "@inertiajs/react";
import React, { useState } from "react";
import HeaderSection from "./_section/header-section";
import TabsSection from "./_section/tabs-section";
export default function ActivitiesLayout({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[4];

    
    return (
        <div className="flex flex-col h-screen">
            <div className="sticky top-0 z-50">
                <HeaderSection />
                <TabsSection />
            </div>
            <div className="flex-1 min-h-0 p-3">
                {children}
            </div>
        </div>
    );
}
