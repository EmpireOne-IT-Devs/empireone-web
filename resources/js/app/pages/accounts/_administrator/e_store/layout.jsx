import Tabs from "@/app/_components/tabs";
import { router } from "@inertiajs/react";
import React, { useState } from "react";
import HeaderSection from "./_sections/header-section";
import StatisticCardSection from "./_sections/statistic-card-section";

export default function StoreAdminLayout({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[4];

    const tabs = [
        {
            label: "Rewards Items",
            path: "/accounts/administrator/e_store/rewards_items",
            active: path == "rewards_items",
        },

        {
            label: "Redemption History",
            path: "/accounts/administrator/e_store/redemption_history",
            active: path == "redemption_history",
        },
        {
            label: "Analytics",
            path: "/accounts/administrator/e_store/analytics",
            active: path == "analytics",
        },
    ];
    return (
        <div>
            <HeaderSection />
            <StatisticCardSection/>
           
            <div className="mt-6 bg-white shadow-sm rounded-2xl border-2 w-4/12">
                <Tabs
                
                tabs={tabs} activeIndex={activeTab} />
            </div>
            
            <div className="p-3">{children}</div>
        </div>
    );
}
