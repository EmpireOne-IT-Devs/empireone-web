import Tabs from "@/app/_components/tabs";
import React, { useState } from "react";
import HeaderSection from "./_sections/header-section";

export default function StoreAdminLayout({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[4];

    const tabs = [
        {
            label: "Test",
            path: "/accounts/administrator/asset_inventory/test",
            active: path == "test",
        },

        // {
        //     label: "Redemption History",
        //     path: "/accounts/administrator/asset_inventory/redemption_history",
        //     active: path == "redemption_history",
        // },
        // {
        //     label: "Analytics",
        //     path: "/accounts/administrator/asset_inventory/analytics",
        //     active: path == "analytics",
        // },
    ];
    return (
        <div>
            <HeaderSection />
       
           
            <div className="mt-6 bg-white shadow-sm rounded-2xl border-2 w-4/12">
                <Tabs
                
                tabs={tabs} activeIndex={activeTab} />
            </div>
            
            <div className="p-3">{children}</div>
        </div>
    );
}
