import { useSelector } from "react-redux";
import TopbarSection from "./_sections/topbar-section";
import store from "@/app/store/store";
import { get_app_data_thunk } from "@/app/redux/app-thunk";
import { useEffect, useState } from "react";
import SidebarSection from "./_sections/sidebar-section";

export default function Layout({ children }) {
    const { desktopCollapsed } = useSelector((store) => store.app);

    useEffect(() => {
        store.dispatch(get_app_data_thunk());
    }, []);
    return (
        <div className="h-full bg-white ">
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
