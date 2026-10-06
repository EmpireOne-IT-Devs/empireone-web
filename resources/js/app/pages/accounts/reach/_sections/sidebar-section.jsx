import React from "react";
import {
    FcPieChart,
    FcApproval,
    FcVoicePresentation,
    FcTodoList,
    FcDocument,
    FcSynchronize
} from "react-icons/fc";
import SubSidebarSection from "./../../__sections/sub-sidebar-section";

export default function MyTeamTabsSection({ children }) {
    const currentPath = typeof window !== "undefined" ? window.location.pathname.split("/")[4] || "dashboard" : "dashboard";

    const tabs = [
        {
            label: "Dashboard",
            name: "Dashboard",
            icon: <FcPieChart className="w-5 h-5 shrink-0" />,
            path: "/accounts/administrator/reach/dashboard",
            active: currentPath === "dashboard" || currentPath === "",
        },
        {
            label: "Recognition",
            name: "Recognation",
            icon: <FcApproval className="w-5 h-5 shrink-0" />,
            path: "/accounts/administrator/reach/recognation",
            active: currentPath === "recognation",
        },
        {
            label: "Evaluation",
            name: "Evaluation",
            icon: <FcVoicePresentation className="w-5 h-5 shrink-0" />,
            path: "/accounts/administrator/reach/evaluation",
            active: currentPath === "evaluation",
        },
        {
            label: "Action Plan",
            name: "action_plan",
            icon: <FcTodoList className="w-5 h-5 shrink-0" />,
            path: "/accounts/administrator/reach/action_plan",
            active: currentPath === "action_plan",
        },
        {
            label: "Commitment",
            name: "commitment",
            icon: <FcDocument className="w-5 h-5 shrink-0" />,
            path: "/accounts/administrator/reach/commitment",
            active: currentPath === "commitment",
        },
        {
            label: "Handoff",
            name: "handoff",
            icon: <FcSynchronize className="w-5 h-5 shrink-0" />,
            path: "/accounts/administrator/reach/handoff",
            active: currentPath === "handoff",
        },
    ];

    return (
        <SubSidebarSection title="REACH Module" tabs={tabs}>
            {children}
        </SubSidebarSection>
    );
}