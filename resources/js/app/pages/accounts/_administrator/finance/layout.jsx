import Tabs from "@/app/_components/tabs";
import { router } from "@inertiajs/react";
import React, { useState } from "react";

export default function FinanceLayout({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[4];

    const tabs = [
        {
            label: "Dashboard",
            path: "/accounts/administrator/finance/dashboard",
            active: path === "dashboard",
        },
        {
            label: "Expenses",
            path: "/accounts/administrator/finance/expenses",
            active: path === "expenses",
        },
        {
            label: "Revenue",
            path: "/accounts/administrator/finance/revenue",
            active: path === "revenue",
        },
         {
            label: "Reports",
            path: "/accounts/administrator/finance/reports",
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
