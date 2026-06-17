import Tabs from "@/app/_components/tabs";
import React from "react";

export default function TabsSection() {
    const currentPath = window.location.pathname.split("/")[4];

    const tabs = [
        {
            label: "Home",
            path: "/accounts/administrator/activities/home",
            active: currentPath === "home",
        },
        {
            label: "Company Newsfeed",
            path: "/accounts/administrator/activities/company_newsfeed",
            active: currentPath === "company_newsfeed",
        },
        {
            label: "Events Calendar",
            path: "/accounts/administrator/activities/events_calendar",
            active: currentPath === "events_calendar",
        },
        {
            label: "Department Showcase",
            path: "/accounts/administrator/activities/department_showcase",
            active: currentPath === "department_showcase",
        },
    ];

    return <Tabs tabs={tabs} />;
}
