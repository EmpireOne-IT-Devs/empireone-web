import Tabs from "@/app/_components/tabs";
import React from "react";
import useCurrentEmployee from "@/app/_hooks/use-current-employee";

export default function TabsSection() {
    const { isReady, isContentManager } = useCurrentEmployee();
    const isAllowedDepartment = isContentManager;
    const currentPath = window.location.pathname.split("/")[4];
    const role = window.location.pathname.split("/")[2];
    const tabs = [
        {
            label: "Home",
            path: `/accounts/${role}/activities/home`,
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
                
              ]
            : []),
              {
                      label: "Department Showcase",
                      path: `/accounts/${role}/activities/department_showcase`,
                      active: currentPath === "department_showcase",
                  },

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

    // Don't render the tab list until we know the department, or tabs pop in/out.
    if (!isReady) {
        return <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />;
    }

    return <Tabs tabs={tabs} />;
}
