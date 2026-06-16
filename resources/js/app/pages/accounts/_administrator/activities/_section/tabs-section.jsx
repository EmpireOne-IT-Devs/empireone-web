import Tabs from "@/app/_components/tabs";
import React, { useState } from "react";

export default function TabsSection() {
    const [activeTab, setActiveTab] = useState(0);
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
        //    {
        //        label: "Disciplinary Records",
        //        path: "/accounts/administrator/human_resources/disciplinary_records",
        //        active: currentPath === "disciplinary_records",
        //    },
        //    {
        //        label: "Separation",
        //        path: "/accounts/administrator/human_resources/separation",
        //        active: currentPath === "separation",
        //    },
       ];
    return (
        <div>
            <Tabs tabs={tabs} activeIndex={activeTab} />
        </div>
    );
}
