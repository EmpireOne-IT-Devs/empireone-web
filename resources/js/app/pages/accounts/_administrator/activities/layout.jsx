import Tabs from "@/app/_components/tabs";
import { router } from "@inertiajs/react";
import React, { useState } from "react";
export default function ActivitiesLayout({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[4];

    const tabs = [
        {
            label: "View",
            path: "/accounts/administrator/activities",
            active: path === undefined,
        },
        {
            label: "Manage Content",
            path: "/accounts/administrator/activities/manage_content/news",
            active: path === "manage_content",
        },
    ];
    return (
        <div>
            <Tabs tabs={tabs} activeIndex={activeTab} />
            <div className="p-3">{children}</div>
        </div>
    );
}
