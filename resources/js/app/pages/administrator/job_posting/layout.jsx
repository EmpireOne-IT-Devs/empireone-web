import Tabs from "@/app/_components/tabs";
import { router } from "@inertiajs/react";
import React, { useState } from "react";

export default function JobPostingLayout({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[3];

    const tabs = [
        {
            label: "Dashboard",
            path: "/administrator/job_posting/dashboard",
            active: path === "dashboard",
        },
        {
            label: "Active Postings",
            path: "/administrator/job_posting/active_posting",
            active: path === "active_posting",
        },
        {
            label: "Applicants",
            path: "/administrator/job_posting/applicants",
            active: path === "applicants",
        },
        {
            label: "Interviews",
            path: "/administrator/job_posting/interviews",
            active: path === "interviews",
        },
    ];
    return (
        <div>
            <Tabs tabs={tabs} activeIndex={activeTab} />
            <div className="p-3">{children}</div>
        </div>
    );
}
