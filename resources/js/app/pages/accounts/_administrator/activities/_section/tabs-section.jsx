import Tabs from "@/app/_components/tabs";
import React from "react";
import { useSelector } from "react-redux";

export default function TabsSection() {
    const { data } = useSelector((store) => store.app);
    const isAllowedDepartment = [1, 11].includes(
        data?.user?.account_employee?.department_id,
    );
    const currentPath = window.location.pathname.split("/")[4];
    const role = window.location.pathname.split("/")[2];
    const tabs = [
        {
            label: "Home",
            path: "/accounts/administrator/activities/home",
            active: currentPath === "home",
        },
        {
            label: "Company Newsfeed",
            path: `/accounts/${role}/activities/company_newsfeed`,
            active: currentPath === "company_newsfeed",
        },
        {
            label: "Events Calendar",
            path: `/accounts/${role}/activities/events_calendar`,
            active: currentPath === "events_calendar",
        },

        ...(isAllowedDepartment
            ? [
                  {
                      label: "Poll Analytics",
                      path: `/accounts/${role}/activities/poll_analytics`,
                      active: currentPath === "poll_analytics",
                  },
                  {
                      label: "Department Showcase",
                      path: `/accounts/${role}/activities/department_showcase`,
                      active: currentPath === "department_showcase",
                  },
              ]
            : []),

        {
            label: "Post Event Survey",
            path: `/accounts/${role}/activities/post_event_survey`,
            active: currentPath === "post_event_survey",
        },
        {
            label: "Company Gallery",
            path: `/accounts/${role}/activities/company_gallery`,
            active: currentPath === "company_gallery",
        },
    ];

    return <Tabs tabs={tabs} />;
}
