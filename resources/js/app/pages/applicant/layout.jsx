import { useSelector } from "react-redux";
import TopbarSection from "./_sections/topbar-section";

import store from "@/app/store/store";
import { get_app_data_thunk } from "@/app/redux/app-thunk";
import { useEffect } from "react";

export default function Layout({ children }) {
    const { desktopCollapsed } = useSelector((store) => store.app);

    useEffect(() => {
        store.dispatch(get_app_data_thunk());
    }, []);
    return (
        <div className="h-full bg-white dark:bg-gray-900">
            <TopbarSection />
            <main className={`flex-1 p-6   ${desktopCollapsed ? "ml-20" : ""}`}>
                {children}
            </main>
        </div>
    );
}
