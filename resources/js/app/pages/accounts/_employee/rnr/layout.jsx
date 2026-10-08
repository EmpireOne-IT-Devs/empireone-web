import Tabs from "@/app/_components/tabs";
import React from "react";
import { 
    Heart, 
    Zap, 
    Star, 
    Coins
} from "lucide-react";
import useCurrentEmployee from "@/app/_hooks/use-current-employee";
import HeaderSection from "./sections/header-section";

export default function RnrLayout({ children }) {
    const { isReady, isContentManager } = useCurrentEmployee();
    const path = window.location.pathname.split("/")[4];
    const role = window.location.pathname.split("/")[2];
    const tabs = [
        {
            label: "Peer Recognition",
             icon: Heart,
            path: `/accounts/${role}/rnr/peer_recognition`,
            active: path === "peer_recognition",
        },
        {
            label: "Challenges & Events",
              icon: Zap,
            path: `/accounts/${role}/rnr/challenge_event`,
            active: path === "challenge_event",
        },
        ...(isContentManager
            ? [
                  {
                      label: "Employee Profiles",
                        icon: Star,
                      path: `/accounts/${role}/rnr/employee_profiles`,
                      active: path === "employee_profiles",
                  },
              ]
            : []),
        {
            label: "My Points",
             icon: Coins,
            path: `/accounts/${role}/rnr/my_profile`,
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
                <Tabs tabs={tabs} />
            )}

            <div className="p-3">{children}</div>
        </div>
    );
}
