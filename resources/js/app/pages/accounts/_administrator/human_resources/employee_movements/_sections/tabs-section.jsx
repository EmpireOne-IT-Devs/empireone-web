import Tabs from "@/app/_components/tabs";
import React, { useState } from "react";

export default function TabsSection() {
    const [activeTab, setActiveTab] = useState(0);
    const currentPath = window.location.pathname.split("/")[5];
    const tabs = [
        {
            label: "Assessment Process",
            path: "/accounts/administrator/human_resources/employee_movements/assessment_process?status=Regular",
            active: currentPath === "assessment_process",
        },
        {
            label: "Employee Status Changes",
            path: "/accounts/administrator/human_resources/employee_movements/employee_status_changes",
            active: currentPath === "employee_status_changes",
        },
    ];
    return (
        <div className="border-2 rounded-lg border-blue-600 py-1 max-w-lg flex items-center justify-center">
            <Tabs tabs={tabs} activeIndex={activeTab} />
        </div>
    );
}
