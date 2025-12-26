import Tabs from "@/app/_components/tabs";
import { router } from "@inertiajs/react";
import React, { useState } from "react";

export default function FinanceLayout({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[3];

    const tabs = [
        {
            label: "Dashboard",
            path: "/administrator/finance/dashboard",
            active: path === "dashboard",
        },
        {
            label: "Expenses",
            path: "/administrator/finance/expenses",
            active: path === "expenses",
        },
        {
            label: "Revenue",
            path: "/administrator/finance/revenue",
            active: path === "revenue",
        },
         {
            label: "Reports",
            path: "/administrator/finance/reports",
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
