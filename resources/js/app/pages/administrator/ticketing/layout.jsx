import Tabs from "@/app/_components/tabs";
import { router } from "@inertiajs/react";
import React, { useState } from "react";
import CreateTicketSection from "./_sections/create-ticket-section";

export default function TicketingLayout({ children }) {
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
            label: "Categories",
            path: "/administrator/ticketing/categories",
            active: path === "categories",
        },
        {
            label: "Tickets",
            path: "/administrator/ticketing/tickets",
            active: path === "tickets",
        },
        {
            label: "Admin   Reports",
            path: "/administrator/ticketing/reports",
            active: path === "reports",
        },
    ];
    return (
        <div >
            <div className="flex gap-3 w-full items-center justify-center">
                <div className="flex-1">
                    <Tabs tabs={tabs} activeIndex={activeTab} />
                </div>
                <CreateTicketSection />
            </div>
            <div className="p-3">{children}</div>
        </div>
    );
}
