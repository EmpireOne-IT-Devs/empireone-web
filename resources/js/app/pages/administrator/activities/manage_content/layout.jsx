import Tabs from "@/app/_components/tabs";
import { router } from "@inertiajs/react";
import React, { useState } from "react";

export default function ManageContentLayout({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[4];

    const tabs = [
        {
            label: "News",
            path: "/administrator/activities/manage_content/news",
            active: path === "news",
        },
        {
            label: "Announcement",
            path: "/administrator/activities/manage_content/announcement",
            active: path === "announcement",
        },
        {
            label: "Events",
            path: "/administrator/activities/manage_content/events",
            active: path === "events",
        },
        {
            label: "Activities",
            path: "/administrator/activities/manage_content/activities",
            active: path === "activities",
        },
    ];
    return (
        <div className="flex flex-col items-start mt-4 border rounded-2xl max-w-lg p-1 bg-white shadow-lg">
            <Tabs tabs={tabs} activeIndex={activeTab} />
            <div className="p-3 w-full">{children}</div>
        </div>
    );
}