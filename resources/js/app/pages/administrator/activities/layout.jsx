import Tabs from "@/app/_components/tabs";
import { router } from "@inertiajs/react";
import React, { useState } from "react";

export default function ActivitiesLayout({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[3];

    const tabs = [
        {
            label: "View",
            path: "/administrator/activities/view",
            active: path === "view",
        },
        {
            label: "Manage Content",
            path: "/administrator/activities/manage_content",
            active: path === "manage_content",
        },
       
    ];
    return (
        <div >
            <Tabs tabs={tabs} activeIndex={activeTab} />
            <div className="p-3">{children}</div>
        </div>
    );
}
