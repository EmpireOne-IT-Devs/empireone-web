import React, { useEffect } from "react";
import SetAttendanceSection from "./sections/set-attendance-section";
import Layout from "../../../layout";
import TimeKeepingLayout from "../layout";
import store from "@/app/store/store";
import { get_employees_thunk } from "@/app/redux/employee-relation-thunk";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_employees_thunk());
    }, [window.location.search]);
    return (
        <Layout>
            <TimeKeepingLayout>
                <SetAttendanceSection />
            </TimeKeepingLayout>
        </Layout>
    );
}
