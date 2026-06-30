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
         {
            label: "Poll Analytics",
            path: "/accounts/administrator/activities/poll_analytics",
            active: currentPath === "poll_analytics",
        },
         {
            label: "Post Event Survey",
            path: "/accounts/administrator/activities/post_event_survey",
            active: currentPath === "post_event_survey",
        },
           {
            label: "Company Gallery",
            path: "/accounts/administrator/activities/company_gallery",
            active: currentPath === "company_gallery",
        },
    ];

    return <Tabs tabs={tabs} />;
}
