import Tabs from "@/app/_components/tabs";
import React, { useState } from "react";

export default function TabsSection() {
    const [activeTab, setActiveTab] = useState(0);
    const user_id = window.location.pathname.split("/")[4];
    const path = window.location.pathname.split("/")[5];
    const type = window.location.pathname.split("/")[3];
    const tabs = [
        {
            label: "Personal Information",
            path: `/accounts/administrator/${type}/${user_id}/personal_information`,
            active: path === "personal_information",
        },
        {
            label: "201 Files",
            path: `/accounts/administrator/${type}/${user_id}/201_files`,
            active: path === "201_files",
        },
        {
            label: "Evaluations",
            path: `/accounts/administrator/${type}/${user_id}/evaluations`,
            active: path === "evaluations",
        },
        {
            label: "Disciplinary Records",
            path: `/accounts/administrator/${type}/${user_id}/disciplinary_records`,
            active: path === "disciplinary_records",
        },
        {
            label: "HMO Details",
            path: `/accounts/administrator/${type}/${user_id}/hmo_details`,
            active: path === "hmo_details",
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
