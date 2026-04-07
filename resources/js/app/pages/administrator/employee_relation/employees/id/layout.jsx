import React, { useEffect } from "react";
import HeaderSection from "./_sections/header-section";
import TabsSection from "./_sections/tabs-section";
import store from "@/app/store/store";
import { get_user_by_id_thunk } from "@/app/redux/app-thunk";

export default function EmployeeLayout({ children }) {
    useEffect(() => {
        store.dispatch(
            get_user_by_id_thunk(window.location.pathname.split("/")[3]),
        );
    }, []);
    return (
        <>
            <div className="min-h-screen bg-gray-50 p-8 text-slate-700 font-sans">
                <HeaderSection />
                <TabsSection />
                {children}
            </div>
        </>
    );
}
