import Tabs from "@/app/_components/tabs";
import { router } from "@inertiajs/react";
import { 
    Heart, 
    Zap, 
    Star, 
    Coins
} from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import HeaderSection from "./sections/header-section";

export default function RnrLayout({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[4];

    const { data } = useSelector((store) => store.app);

    const tabs = [
        {
            label: "Peer Recognition",
            path: "/accounts/administrator/rnr/peer_recognition",
            icon: Heart,
            active: path === "peer_recognition",
        },
        {
            label: "Challenges & Events",
            path: "/accounts/administrator/rnr/challenges_events",
            icon: Zap,
            active: path === "challenges_events",
        },
        ...([1, 11].includes(data?.user?.account_employee?.department_id)
            ? [
                  {
                      label: "Employee Profiles",
                      path: "/accounts/administrator/rnr/employee_profiles",
                      icon: Star, // Or User / Trophy depending on preference
                      active: path === "employee_profiles",
                  },
              ]
            : []),
        {
            label: "My Points",
            path: "/accounts/administrator/rnr/my_profile",
            icon: Coins,
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