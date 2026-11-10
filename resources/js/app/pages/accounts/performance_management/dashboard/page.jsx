import React, { useEffect } from "react";
import PerformanceManagementLayout from "./../layout";
import CardSection from "./_sections/card-section";
import store from "@/app/store/store";
import { performance_management_dashboard_thunk } from "@/app/redux/employee-relation-thunk";
export default function Page() {
    useEffect(() => {
        store.dispatch(performance_management_dashboard_thunk());
    }, []);

    return (
        <PerformanceManagementLayout>
            <CardSection />
        </PerformanceManagementLayout>
    );
}
