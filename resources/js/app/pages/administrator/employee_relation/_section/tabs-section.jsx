import Tabs from "@/app/_components/tabs";
import React, { useState } from "react";

export default function TabsSection() {
    const [activeTab, setActiveTab] = useState(0);
    const currentPath = window.location.pathname.split("/")[3];
    const tabs = [
        {
            label: "Employees",
            path: "/administrator/employee_relation/employees",
            active: currentPath === "employees",
        },
        {
            label: "Pooling",
            path: "/administrator/employee_relation/pooling",
            active: currentPath === "pooling",
        },
    ];
    return (
        <div>
            <Tabs tabs={tabs} activeIndex={activeTab} />
        </div>
    );
}
