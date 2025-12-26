import SidebarSection from "./_sections/sidebar-section";
import { useSelector } from "react-redux";
import TopbarSection from "./_sections/topbar-section";

import Tooltip from "@/app/_components/tooltip";
import Button from "@/app/_components/button";
import Accordion from "@/app/_components/accordion";
import { Children } from "react";

export default function Layout({children}) {
    const { desktopCollapsed } = useSelector((store) => store.app);

    return (
        <div className="h-full bg-white dark:bg-gray-900">
            <SidebarSection />
            <div
                className={`${
                    desktopCollapsed ? "" : "lg:pl-72"
                } flex flex-col min-h-screen transition-all duration-300`}
            >
                <TopbarSection />
                <main
                    className={`flex-1 p-6 ${desktopCollapsed ? "ml-20" : ""}`}
                >
                {children}
                </main>
            </div>
        </div>
    );
}
