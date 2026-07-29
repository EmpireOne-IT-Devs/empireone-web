import Tabs from "@/app/_components/tabs";
import { router } from "@inertiajs/react";
import React, { useState } from "react";
import HeaderSection from "./sections/header-section";

export default function RnrLayout({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[4];

    const tabs = [
        {
            label: "Peer Recognition",
            path: "/accounts/administrator/rnr/peer_recognition",
            active: path === "peer_recognition",
        },
        {
            label: "Challenges & Events",
            path: "/accounts/administrator/rnr/challenges_events",
            active: path === "challenges_events",
        },
        {
            label: "Employee Profiles",
            path: "/accounts/administrator/rnr/employee_profiles",
            active: path === "employee_profiles",
        },
    ];
    return (
        <div>
            <HeaderSection />

            <Tabs tabs={tabs} activeIndex={activeTab} />
         
            <div className="p-3">{children}</div>
        </div>
    );
}
