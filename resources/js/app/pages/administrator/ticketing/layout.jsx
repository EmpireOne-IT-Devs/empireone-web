import Tabs from "@/app/_components/tabs";
import { router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import CreateTicketSection from "./_sections/create-ticket-section";
import store from "@/app/store/store";
import { get_ticketing_tables_thunk } from "@/app/redux/tickets-thunk";

export default function TicketingLayout({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[3];

    useEffect(() => {
        store.dispatch(get_ticketing_tables_thunk());
    }, []);

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
        <div>
            <div className="flex gap-3 w-full items-center justify-center">
                <div className="flex-1">
                    <Tabs tabs={tabs} activeIndex={activeTab} />
                </div>
                <div className="mb-4">
                        <CreateTicketSection />
                </div>
            
            </div>
            <div className="p-3">{children}</div>
        </div>
    );
}
