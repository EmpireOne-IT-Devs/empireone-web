import Tabs from "@/app/_components/tabs";
import { router } from "@inertiajs/react";
import React, { useState } from "react";
import HeaderSection from "./_sections/header-section";

export default function JobPostingLayout({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[4];

    const tabs = [
        {
            label: "Dashboard",
            path: "/accounts/administrator/talent_acquisition/dashboard",
            active: path === 'dashboard',
        },
         {
            label: "Job Requisition",
            path: "/accounts/administrator/talent_acquisition/job_requisition",
            active: path === "job_requisition",
        },
        {
            label: "Job Postings",
            path: "/accounts/administrator/talent_acquisition/job_posting",
            active: path === "job_posting",
        },
        {
            label: "Applicants",
            path: "/accounts/administrator/talent_acquisition/applicants",
            active: path === "applicants",
        },
        {
            label: "Job Offers",
            path: "/accounts/administrator/talent_acquisition/job_offers",
            active: path === "job_offers",
        },
        // {
        //     label: "Interviews",
        //     path: "/accounts/administrator/talent_acquisition/interviews",
        //     active: path === "interviews",
        // },
        {
            label: "QR Codes",
            path: "/accounts/administrator/talent_acquisition/qr_code",
            active: path === "qr_code",
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
