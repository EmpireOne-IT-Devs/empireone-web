import clsx from "clsx";
import { Link } from "@inertiajs/react";
import React from "react";
import ActivitiesLayout from "../layout";

export default function ManageContentLayout({ children }) {
    const path = window.location.pathname.split("/")[4];

    const tabs = [
        {
            label: "News",
            path: "/administrator/activities/manage_content/news",
            active: path === "news",
        },
        {
            label: "Announcements",
            path: "/administrator/activities/manage_content/announcement",
            active: path === "announcement",
        },
        {
            label: "Events",
            path: "/administrator/activities/manage_content/events",
            active: path === "events",
        },
        {
            label: "Activities",
            path: "/administrator/activities/manage_content/activities",
            active: path === "activities",
        },
    ];

    return (
        <ActivitiesLayout>
            <div className="mt-4 inline-flex gap-2 items-center border rounded-xl bg-white p-1 shadow-lg">
                {tabs.map((tab) => (
                    <Link
                        key={tab.label}
                        href={tab.path}
                        className={clsx(
                            "px-4 py-2 text-md font-medium  rounded-lg transition-all",
                            tab.active
                                ? "bg-blue-600 text-white shadow "
                                : "text-gray-600 hover:bg-gray-100"
                        )}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>

            <div className="p-4">{children}</div>
        </ActivitiesLayout>
    );
}
