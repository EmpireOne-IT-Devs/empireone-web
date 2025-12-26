import Tabs from "@/app/_components/tabs";
import { router } from "@inertiajs/react";
import React, { useState } from "react";

export default function TicketingLayout({children}) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[3];

    const tabs = [
        {
            label: "Dashboard",
            path: "/administrator/ticketing/dashboard",
            active: path === "dashboard",
        },
        {
            label: "My Tickets",
            path: "/administrator/ticketing/my_tickets",
            active: path === "my_tickets",
        },
        {
            label: "Categories & Sites",
            path: "/administrator/ticketing/sites_categories",
            active: path === "sites_categories",
        },
        {
            label: "Tickets",
            path: "/administrator/ticketing/tickets",
            active: path === "tickets",
        },
        {
            label: "Reports",
            path: "/administrator/ticketing/reports",
            active: path === "reports",
        },
    ];
    return (
        <div>
            <Tabs
                tabs={tabs}
                activeIndex={activeTab}
            />
            <div className="p-3">
                {children}
            </div>
        </div>
    );
}
