import Tabs from "@/app/_components/tabs";
import React from "react";

export default function TimeKeepingLayout({ children }) {
    const path = window.location.pathname.split("/")[4];

    const tabs = [
        {
            label: "Dashboard",
            path: "/accounts/employee/time_keeping/dashboard",
            active: path === "dashboard",
        },
        {
            label: "Attendance",
            path: "/accounts/employee/time_keeping/attendance",
            active: path === "attendance",
        },
        {
            label: "Employee Calendar",
            path: "/accounts/employee/time_keeping/employee_calendar",
            active: path === "employee_calendar",
        },
        {
            label: "Time Sheets",
            path: "/accounts/employee/time_keeping/time_sheets",
            active: path === "time_sheets",
        },
    ];
    return (
        <div>
            <Tabs tabs={tabs} />
            <div className="p-3">{children}</div>
        </div>
    );
}
