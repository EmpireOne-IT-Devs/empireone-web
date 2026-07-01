import Tabs from "@/app/_components/tabs";
import React from "react";

export default function TabsSection() {
    const currentPath = window.location.pathname.split("/")[4];

    const tabs = [
        {
            label: "Home",
            path: "/accounts/employee/activities/home",
            active: currentPath === "home",
        },
        {
            label: "Company Newsfeed",
            path: "/accounts/employee/activities/company_newsfeed",
            active: currentPath === "company_newsfeed",
        },
        {
            label: "Events Calendar",
            path: "/accounts/employee/activities/events_calendar",
            active: currentPath === "events_calendar",
        },
        {
            label: "Department Showcase",
            path: "/accounts/employee/activities/department_showcase",
            active: currentPath === "department_showcase",
        },
        {
            label: "Post Event Survey",
            path: "/accounts/employee/activities/post_event_survey",
            active: currentPath === "post_event_survey",
        },
    ];

    return <Tabs tabs={tabs} />;
}
