import React from "react";
import { useSelector } from "react-redux";
import {
    FcConferenceCall,
    FcBriefcase,
    FcVoicePresentation,
    FcFolder,
    FcDocument,
    FcOpenedFolder,
    FcNightPortrait,
    FcServices
} from "react-icons/fc";
import SubSidebarSection from "./../../../__sections/sub-sidebar-section";

export default function HRTabsSection({ children }) {
    const { data } = useSelector((store) => store.app);

    const currentPath = typeof window !== "undefined" ? window.location.pathname.split("/")[4] : "";
    const currentSubPath = typeof window !== "undefined" ? window.location.pathname.split("/")[5] : "";
    const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const currentLocationId = searchParams ? searchParams.get("location_id") : null;

    const tabs = [
        {
            label: "Employees",
            icon: <FcConferenceCall className="w-5 h-5 shrink-0" />,
            active: currentPath === "employees",
            children: data?.locations?.map((res) => ({
                label: res.name,
                path: `/accounts/administrator/human_resources/employees?location_id=${res.id}`,
                active: currentPath === "employees" && currentLocationId === String(res.id),
            }))
        },
        {
            label: "Leaders",
            icon: <FcBriefcase className="w-5 h-5 shrink-0" />,
            active: currentPath === "leads",
            children: data?.locations?.map((res) => ({
                label: res.name,
                path: `/accounts/administrator/human_resources/leads?location_id=${res.id}`,
                active: currentPath === "leads" && currentLocationId === String(res.id),
            }))
        },
        {
            label: "Employee Movements",
            icon: <FcVoicePresentation className="w-5 h-5 shrink-0" />,
            active: currentPath === "employee_movements",
            children: data?.locations?.map((res) => ({
                label: res.name,
                path: `/accounts/administrator/human_resources/employee_movements?status=Regular&location_id=${res.id}`,
                active: currentPath === "employee_movements" && currentLocationId === String(res.id),
            }))
        },
        {
            label: "Separation",
            icon: <FcNightPortrait className="w-5 h-5 shrink-0" />,
            active: currentPath === "separation",
            children: data?.locations?.map((res) => ({
                label: res.name,
                path: `/accounts/administrator/human_resources/separation?location_id=${res.id}`,
                active: currentPath === "separation" && currentLocationId === String(res.id),
            }))
        },
        {
            label: "201Files",
            icon: <FcOpenedFolder className="w-5 h-5 shrink-0" />,
            active: currentPath === "201Files",
            children: data?.locations?.map((res) => ({
                label: res.name,
                path: `/accounts/administrator/human_resources/201Files?location_id=${res.id}`,
                active: currentPath === "201Files" && currentLocationId === String(res.id),
            }))
        },
        {
            label: "Sourcing",
            icon: <FcServices className="w-5 h-5 shrink-0" />,
            active: currentPath === "sourcing",
            children: [{
                label: 'Accounts',
                path: '/accounts/administrator/human_resources/sourcing/accounts',
                active: currentSubPath === "accounts",
            }, {
                label: 'Departments',
                path: '/accounts/administrator/human_resources/sourcing/departments',
                active: currentSubPath === "departments",
            }]?.map((res) => ({
                label: res.label,
                path: res.path,
                active: res.active,
            }))
        },
        {
            label: "Acknowledgements",
            icon: <FcDocument className="w-5 h-5 shrink-0" />,
            path: "/accounts/administrator/human_resources/acknowledgements",
            active: currentPath === "acknowledgements",
        },

    ];

    return (
        <SubSidebarSection title="HR Module" tabs={tabs}>
            {children}
        </SubSidebarSection>
    );
}