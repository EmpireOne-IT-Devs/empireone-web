import React from "react";
import {
    FcPieChart,
    FcConferenceCall,
    FcVoicePresentation,
    FcFolder
} from "react-icons/fc";
import SubSidebarSection from "./../../__sections/sub-sidebar-section";

export default function MyTeamTabsSection({ children }) {
    const currentPath = typeof window !== "undefined" ? window.location.pathname.split("/")[4] || "dashboard" : "dashboard";

    const tabs = [
        {
            label: "Dashboard",
            name: "Dashboard",
            icon: <FcPieChart className="w-5 h-5 shrink-0" />,
            path: "/accounts/administrator/my_team",
            active: currentPath === "dashboard" || currentPath === "",
        },
        {
            label: "My Team",
            name: "My Team",
            icon: <FcConferenceCall className="w-5 h-5 shrink-0" />,
            path: "/accounts/administrator/my_team/team",
            active: currentPath === "team",
        },
        {
            label: "Corrective Action",
            name: "Corrective Action",
            icon: <FcVoicePresentation className="w-5 h-5 shrink-0" />,
            path: "/accounts/administrator/my_team/corrective_action",
            active: currentPath === "corrective_action",
        },
        {
            label: "Assessment Process",
            name: "Assessment Process",
            icon: <FcFolder className="w-5 h-5 shrink-0" />,
            path: "/accounts/administrator/my_team/assessment_process",
            active: currentPath === "assessment_process",
        },
    ];

    return (
        <SubSidebarSection title="My Team Module" tabs={tabs}>
            {children}
        </SubSidebarSection>
    );
}