import Tabs from "@/app/_components/tabs";
import { router } from "@inertiajs/react";
import React, { useState } from "react";

export default function RnrLayout({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[4];

    const tabs = [
        {
            label: "Grand Rewards",
            path: "/accounts/administrator/rnr/grand_rewards",
            active: path === "grand_rewards",
        },
        {
            label: "Leaderboard",
            path: "/accounts/administrator/rnr/leaderboard",
            active: path === "leaderboard",
        },
        {
            label: "Manage Rewards",
            path: "/accounts/administrator/rnr/manage_rewards",
            active: path === "manage_rewards",
        },
     
    ];
    return (
        <div>
            <Tabs tabs={tabs} activeIndex={activeTab} />
            <div className="p-3">{children}</div>
        </div>
    );
}
