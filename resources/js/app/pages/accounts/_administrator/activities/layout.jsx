import Tabs from "@/app/_components/tabs";
import { router } from "@inertiajs/react";
import React, { useState } from "react";
import HeaderSection from "./_section/header-section";
import TabsSection from "./_section/tabs-section";
export default function ActivitiesLayout({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[4];

    
    return (
        <div>
            <HeaderSection />
            <TabsSection />
            <div className="p-3">{children}</div>
        </div>
    );
}
