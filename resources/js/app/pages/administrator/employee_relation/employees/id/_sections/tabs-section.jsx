import Tabs from "@/app/_components/tabs";
import React, { useState } from "react";

export default function TabsSection() {
    // const tabs = [
    //     "Personal info",
    //     "Employee details",
    //     "Payroll details",
    //     "Documents",
    //     "Payroll history",
    //     "Medical history",
    //     "Leave history",
    //     "Attendance",
    // ];

    const [activeTab, setActiveTab] = useState(0);
    const user_id = window.location.pathname.split("/")[3];
    const path = window.location.pathname.split("/")[4];

    const tabs = [
        {
            label: "Personal Information",
            path: `/administrator/employee_relation/${user_id}/personal_information`,
            active: path === "personal_information",
        },
        {
            label: "Employee Details",
            path: `/administrator/employee_relation/${user_id}/employee_details`,
            active: path === "employee_details",
        },
        {
            label: "Onboarding Documents",
            path: `/administrator/employee_relation/${user_id}/onboarding`,
            active: path === "onboarding",
        },
        {
            label: "Contract Documents",
            path: `/administrator/employee_relation/${user_id}/contract`,
            active: path === "contract",
        },
        // {
        //     label: "Reports",
        //     path: "/administrator/finance/reports",
        //     active: path === "reports",
        // },
    ];
    return (
        <div>
            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
                <Tabs tabs={tabs} activeIndex={activeTab} />
            </div>
        </div>
    );
}
