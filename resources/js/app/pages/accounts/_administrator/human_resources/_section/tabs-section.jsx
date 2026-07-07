import Tabs from "@/app/_components/tabs";
import React, { useState } from "react";

export default function TabsSection() {
    const [activeTab, setActiveTab] = useState(0);
    const currentPath = window.location.pathname.split("/")[4];
    const tabs = [
        {
            label: "Employees",
            path: "/accounts/administrator/human_resources/employees",
            active: currentPath === "employees",
        },
        {
            label: "Pooling",
            path: "/accounts/administrator/human_resources/pooling",
            active: currentPath === "pooling",
        },
        {
            label: "Executives/Managers/Leaders",
            path: "/accounts/administrator/human_resources/leads",
            active: currentPath === "leads",
        },
        {
            label: "Employee Movements",
            path: "/accounts/administrator/human_resources/employee_movements/assessment_process?status=Regular",
            active: currentPath === "employee_movements",
        },
        {
            label: "Disciplinary Records",
            path: "/accounts/administrator/human_resources/disciplinary_records",
            active: currentPath === "disciplinary_records",
        },
        {
            label: "Separation",
            path: "/accounts/administrator/human_resources/separation",
            active: currentPath === "separation",
        },
    ];
    return (
        <div>
            <Tabs tabs={tabs} activeIndex={activeTab} />
        </div>
    );
}
