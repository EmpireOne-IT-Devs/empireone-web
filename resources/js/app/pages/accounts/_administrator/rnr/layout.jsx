import Tabs from "@/app/_components/tabs";
import { router } from "@inertiajs/react";
import { 
    Heart, 
    Zap, 
    Star, 
    Coins
} from "lucide-react";
import React, { useState } from "react";
import HeaderSection from "./sections/header-section";
import useCurrentEmployee from "@/app/_hooks/use-current-employee";

export default function RnrLayout({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[4];

    const { isReady, isContentManager } = useCurrentEmployee();

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
        ...(isContentManager
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

            {/* Hold the tab row as a skeleton until the department is known, so tabs don't pop in. */}
            {!isReady ? (
                <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
            ) : (
                <Tabs tabs={tabs} activeIndex={activeTab} />
            )}

            <div className="p-3">{children}</div>
        </div>
    );
}