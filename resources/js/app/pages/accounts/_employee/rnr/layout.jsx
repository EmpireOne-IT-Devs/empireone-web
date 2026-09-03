import Tabs from "@/app/_components/tabs";
import React, { useState } from "react";
import HeaderSection from "./sections/header-section";

export default function RnrLayout({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[4];

    const tabs = [
        {
            label: "Peer Recognition",
            path: "/accounts/employee/rnr/peer_recognition",
            active: path === "peer_recognition",
        },
        {
            label: "Challenges & Events",
            path: "/accounts/employee/rnr/challenge_event",
            active: path === "challenge_event",
        },
        {
            label: "My Profiles",
            path: "/accounts/employee/rnr/my_profile",
            active: path === "my_profile",
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
