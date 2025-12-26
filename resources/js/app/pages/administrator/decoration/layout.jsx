import Tabs from "@/app/_components/tabs";
import { router } from "@inertiajs/react";
import React, { useState } from "react";

export default function DecorationLayout({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const path = window.location.pathname.split("/")[3];

    const tabs = [
        {
            label: "Avatar Decorations",
            path: "/administrator/decoration/avatar_decorations",
            active: path === "avatar_decorations",
        },
        {
            label: "Profile Effects",
            path: "/administrator/decoration/profile_effects",
            active: path === "profile_effects",
        },
      
     
    ];
    return (
        <div>
            <Tabs tabs={tabs} activeIndex={activeTab} />
            <div className="p-3">{children}</div>
        </div>
    );
}
