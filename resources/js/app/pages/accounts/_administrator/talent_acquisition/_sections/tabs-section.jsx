import React from "react";
import { useSelector } from "react-redux";
import {
    FcConferenceCall,
    FcBriefcase,
    FcDataSheet,
    FcCalendar,
    FcDocument
} from "react-icons/fc";
import SubSidebarSection from "./../../../__sections/sub-sidebar-section";

export default function TATabsSection({ children }) {
    const { data } = useSelector((store) => store.app);

    const currentPath = typeof window !== "undefined" ? window.location.pathname.split("/")[4] : "job_posting";
    const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const currentLocationId = searchParams ? searchParams.get("location_id") : null;

    const tabs = [
        {
            label: "Job Postings",
            name: "Job Postings",
            icon: <FcBriefcase className="w-5 h-5 shrink-0" />,
            active: currentPath === "job_posting",
            children: data?.locations?.map((res) => ({
                label: res.name,
                name: res.name,
                path: `/accounts/administrator/talent_acquisition/job_posting?location_id=${res.id}`,
                active: currentPath === "job_posting" && currentLocationId === String(res.id),
            })),
        },
        {
            label: "Applicants",
            name: "Applicants",
            icon: <FcConferenceCall className="w-5 h-5 shrink-0" />,
            active: currentPath === "applicants",
            children: data?.locations?.map((res) => ({
                label: res.name,
                name: res.name,
                path: `/accounts/administrator/talent_acquisition/applicants?location_id=${res.id}`,
                active: currentPath === "applicants" && currentLocationId === String(res.id),
            })),
        },
        {
            label: "ERP",
            name: "ERP",
            icon: <FcDataSheet className="w-5 h-5 shrink-0" />,
            active: currentPath === "erp",
            children: data?.locations?.map((res) => ({
                label: res.name,
                name: res.name,
                path: `/accounts/administrator/talent_acquisition/erp?location_id=${res.id}`,
                active: currentPath === "erp" && currentLocationId === String(res.id),
            })),
        },
        {
            label: "Calendar",
            name: "Calendar",
            icon: <FcCalendar className="w-5 h-5 shrink-0" />,
            active: currentPath === "calendar",
            children: data?.locations?.map((res) => ({
                label: res.name,
                name: res.name,
                path: `/accounts/administrator/talent_acquisition/calendar?location_id=${res.id}`,
                active: currentPath === "calendar" && currentLocationId === String(res.id),
            })),
        },
        {
            label: "Job Requisition",
            name: "Job Requisition",
            icon: <FcDocument className="w-5 h-5 shrink-0" />,
            active: currentPath === "job_requisition",
            children: data?.locations?.map((res) => ({
                label: res.name,
                name: res.name,
                path: `/accounts/administrator/talent_acquisition/job_requisition?location_id=${res.id}`,
                active: currentPath === "job_requisition" && currentLocationId === String(res.id),
            })),
        },
    ];

    return (
        <SubSidebarSection title="TA Module" tabs={tabs}>
            {children}
        </SubSidebarSection>
    );
}