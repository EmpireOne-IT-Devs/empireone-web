import Tabs from "@/app/_components/tabs";
import { router } from "@inertiajs/react";
import React, { useState } from "react";

export default function JobPostingLayout({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[4];

    const tabs = [
        {
            label: "Dashboard",
            path: "/accounts/administrator/job_posting",
            active: path === undefined,
        },
        {
            label: "Active Postings",
            path: "/accounts/administrator/job_posting/active_posting",
            active: path === "active_posting",
        },
        {
            label: "Applicants",
            path: "/accounts/administrator/job_posting/applicants",
            active: path === "applicants",
        },
        {
            label: "Job Offers",
            path: "/accounts/administrator/job_posting/job_offers",
            active: path === "job_offers",
        },
        // {
        //     label: "Interviews",
        //     path: "/accounts/administrator/job_posting/interviews",
        //     active: path === "interviews",
        // },
        {
            label: "QR Codes",
            path: "/accounts/administrator/job_posting/qr_code",
            active: path === "qr_code",
        },
    ];
    return (
        <div>
            <Tabs tabs={tabs} activeIndex={activeTab} />
            <div className="p-3">{children}</div>
        </div>
    );
}
