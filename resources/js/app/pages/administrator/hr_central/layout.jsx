import Tabs from "@/app/_components/tabs";
import { router } from "@inertiajs/react";
import React, { useState } from "react";

export default function HrCentralLayout({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[3];

    const tabs = [
        {
            label: "Overview",
            path: "/administrator/hr_central/overview",
            active: path === "overview",
        },
        {
            label: "Recruitment",
            path: "/administrator/hr_central/recruitment",
            active: path === "recruitment",
        },
        {
            label: "Onboarding",
            path: "/administrator/hr_central/onboarding",
            active: path === "onboarding",
        },
        {
            label: "Performance",
            path: "/administrator/hr_central/performance",
            active: path === "performance",
        },
           {
            label: "Learning Management",
            path: "/administrator/hr_central/learning_management",
            active: path === "learning_management",
        },
         {
            label: "Payroll",
            path: "/administrator/hr_central/payroll",
            active: path === "payroll",
        },
    ];
    return (
        <div>
            <Tabs tabs={tabs} activeIndex={activeTab} />
            <div className="p-3">{children}</div>
        </div>
    );
}
