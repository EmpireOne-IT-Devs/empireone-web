import Tabs from "@/app/_components/tabs";
import { router } from "@inertiajs/react";
import React, { useState } from "react";

export default function StoreAdminLayout({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[4];

    const tabs = [
        {
            label: "Analytics",
            path: "/accounts/administrator/e_store/analytics",
            active: path == "analytics",
        },
        {
            label: "Redemption History",
            path: "/accounts/administrator/e_store/redemption_history",
            active: path == "redemption_history",
        },
        {
            label: "Rewards Items",
            path: "/accounts/administrator/e_store/rewards_items",
            active: path == "rewards_items",
        },
     
    ];
    return (
        <div>
            <Tabs tabs={tabs} activeIndex={activeTab} />
            <div className="p-3">{children}</div>
        </div>
    );
}
