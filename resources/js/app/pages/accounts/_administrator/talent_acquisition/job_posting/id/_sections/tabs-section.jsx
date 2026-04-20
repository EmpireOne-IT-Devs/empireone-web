import Tabs from "@/app/_components/tabs";
import React, { useState } from "react";

export default function TabsSection() {
    const [activeTab, setActiveTab] = useState(0);
    const job_posting_id = window.location.pathname.split("/")[5];
    const currentPath = window.location.pathname.split("/")[6];
    const tabs = [
        {
            label: "Applicants",
            path: `/accounts/administrator/talent_acquisition/job_posting/${job_posting_id}/applicants`,
            active: currentPath === "applicants",
        },
        {
            label: "Job Offers",
            path: `/accounts/administrator/talent_acquisition/job_posting/${job_posting_id}/job_offers`,
            active: currentPath === "job_offers",
        },
    ];
    return (
        <div>
            <Tabs tabs={tabs} activeIndex={activeTab} />
        </div>
    );
}
