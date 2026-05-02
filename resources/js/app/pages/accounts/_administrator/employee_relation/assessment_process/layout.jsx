import React, { useEffect } from "react";
import TabsSection from "./_sections/tabs-section";
import store from "@/app/store/store";
import { get_performance_evaluation_thunk } from "@/app/redux/employee-relation-thunk";

export default function AssessmentProcessLayout({ children }) {
    useEffect(() => {
        store.dispatch(get_performance_evaluation_thunk());
    }, []);

    return (
        <>
            <TabsSection />
            {children}
        </>
    );
}
