import Tabs from "@/app/_components/tabs";
import React, { useState } from "react";

export default function TabsSection() {
    const [activeTab, setActiveTab] = useState(0);
    const user_id = window.location.pathname.split("/")[3];
    const path = window.location.pathname.split("/")[4];

    const tabs = [
        {
            label: "Personal Information",
            path: `/administrator/employee_relation/${user_id}/personal_information`,
            active: path === "personal_information",
        },
        {
            label: "201 Files",
            path: `/administrator/employee_relation/${user_id}/201_files`,
            active: path === "201_files",
        },
    ];
    return (
        <div>
            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
                <Tabs tabs={tabs} activeIndex={activeTab} />
            </div>
        </div>
    );
}
