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
            label: "Regularization",
            path: "/accounts/administrator/employee_relation/regularization",
            active: currentPath === "regularization",
        },
        {
            label: "Disciplinary Records",
            path: "/accounts/administrator/employee_relation/disciplinary_records",
            active: currentPath === "disciplinary_records",
        },
        {
            label: "Separation / Attrition ",
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
