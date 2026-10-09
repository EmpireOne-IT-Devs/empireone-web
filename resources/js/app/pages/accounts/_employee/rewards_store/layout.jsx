import Tabs from "@/app/_components/tabs";
import React from "react";
import HeaderSection from "./sections/header-section";

export default function RewardsStoreLayout({ children }) {
    const role = window.location.pathname.split("/")[2];
    const path = window.location.pathname.split("/")[4];

    const tabs = [
        {
            label: "Rewards Items",
            path: `/accounts/${role}/rewards_store/rewards_items`,
            active: path === "rewards_items",
        },
        {
            label: "Redemption History",
            path: `/accounts/${role}/rewards_store/redemption_history`,
            active: path === "redemption_history",
        },
    ];

    return (
        <div>
            <HeaderSection />
            <Tabs tabs={tabs} />
            <div className="p-3">{children}</div>
        </div>
    );
}