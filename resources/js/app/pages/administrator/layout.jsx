import SidebarSection from "./_sections/sidebar-section";
import { useSelector } from "react-redux";
import TopbarSection from "./_sections/topbar-section";

import Tooltip from "@/app/_components/tooltip";
import Button from "@/app/_components/button";
import Accordion from "@/app/_components/accordion";
import { Children, useEffect } from "react";
import store from "@/app/store/store";
import { get_app_data_thunk } from "@/app/redux/app-thunk";

export default function Layout({ children }) {
    const { desktopCollapsed } = useSelector((store) => store.app);

    useEffect(()=>{
        store.dispatch(get_app_data_thunk())
    },[])
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
                    className={`flex-1 p-6 bg-gray-100  ${desktopCollapsed ? "ml-20" : ""}`}
                >
                {children}
                </main>
            </div>
        </div>
    );
}
