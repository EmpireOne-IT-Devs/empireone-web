import React from "react";
import {
    FcPieChart,
    FcPortraitMode,
    FcLeave,
} from "react-icons/fc";
import SubSidebarSection from "./../../__sections/sub-sidebar-section";

export default function SidebarSection({ children }) {
    const currentPath = typeof window !== "undefined" ? window.location.pathname.split("/")[4] || "dashboard" : "dashboard";

    const tabs = [
        {
            label: "Dashboard",
            name: "Dashboard",
            icon: <FcPieChart className="w-5 h-5 shrink-0" />,
            path: "/accounts/administrator/performance_management/dashboard",
            active: currentPath === "dashboard" || currentPath === "",
        },
        {
            label: "REACH",
            name: "Reach",
            icon: <FcPortraitMode className="w-5 h-5 shrink-0" />,
            path: "/accounts/administrator/performance_management/reach",
            active: currentPath === "reach",
        },
        {
            label: "Corrective Action",
            name: "Corrective_action",
            icon: <FcLeave className="w-5 h-5 shrink-0" />,
            path: "/accounts/administrator/performance_management/corrective_action",
            active: currentPath === "corrective_action",
        },
    ];

    return (
        <SubSidebarSection title="Performace Module" tabs={tabs}>
            {children}
        </SubSidebarSection>
    );
}