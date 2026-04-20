import React, { useEffect } from "react";
import TabsSection from "./_sections/tabs-section";
import store from "@/app/store/store";
import { get_job_application_by_id_thunk } from "@/app/redux/job-posting-thunk";

export default function LayoutActiveJobPostingID({ children }) {
    useEffect(() => {
        store.dispatch(get_job_application_by_id_thunk());
    }, []);
    return (
        <>
            <TabsSection />
            {children}
        </>
    );
}
