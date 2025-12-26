import Tabs from "@/app/_components/tabs";
import { router } from "@inertiajs/react";
import React, { useState } from "react";

export default function TimeKeepingLayout({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[3];

    const tabs = [
        {
            label: "Dashboard",
            path: "/administrator/time_keeping/dashboard",
            active: path === "dashboard",
        },
        {
            label: "Attendance",
            path: "/administrator/time_keeping/attendance",
            active: path === "attendance",
        },
        {
            label: "Time Sheets",
            path: "/administrator/time_keeping/time_sheets",
            active: path === "time_sheets",
        },
         {
            label: "Reports",
            path: "/administrator/time_keeping/reports",
            active: path === "reports",
        },
     
    ];
    return (
        <div>
            <Tabs tabs={tabs} activeIndex={activeTab} />
            <div className="p-3">{children}</div>
        </div>
    );
}
