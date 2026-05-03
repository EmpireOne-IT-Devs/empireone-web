import Tabs from "@/app/_components/tabs";
import React, { useState } from "react";

export default function TabsSection() {
    const [activeTab, setActiveTab] = useState(0);
    const currentPath = window.location.pathname.split("/")[4];
    const tabs = [
        {
            label: "Employees",
            path: "/accounts/administrator/employee_relation/employees",
            active: currentPath === "employees",
        },
        {
            label: "Pooling",
            path: "/accounts/administrator/employee_relation/pooling",
            active: currentPath === "pooling",
        },
        {
            label: "Leads",
            path: "/accounts/administrator/employee_relation/leads",
            active: currentPath === "leads",
        },
        {
            label: "Assessment Process",
            path: "/accounts/administrator/employee_relation/assessment_process/mid_regularization?status=Mid-Probationary",
            active: currentPath === "assessment_process",
        },
        {
            label: "Disciplinary Records",
            path: "/accounts/administrator/employee_relation/disciplinary_records",
            active: currentPath === "disciplinary_records",
        },
        {
            label: "Separation",
            path: "/accounts/administrator/employee_relation/separation",
            active: currentPath === "separation",
        },
    ];
    return (
        <div>
            <Tabs tabs={tabs} activeIndex={activeTab} />
        </div>
    );
}
