import React, { useEffect } from "react";
import Layout from "../../../layout";
import TimeKeepingLayout from "../layout";
import TimeSheetSection from "./sections/time-sheet-section";
import store from "@/app/store/store";
import { get_employees_thunk } from "@/app/redux/employee-relation-thunk";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_employees_thunk(true));
    }, [window.location.search]);
    return (
        <Layout>
            <TimeKeepingLayout>
                <TimeSheetSection />
            </TimeKeepingLayout>
        </Layout>
    );
}
