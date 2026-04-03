import React, { useEffect } from "react";
import HeaderSection from "./sections/header-section";
import Layout from "./../layout";
import TableSection from "./sections/table-section";
import store from "@/app/store/store";
import { get_job_application_by_user_thunk } from "@/app/redux/applicant-thunk";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_job_application_by_user_thunk());
    }, []);
    return (
        <Layout>
            <div className="mb-4">
                <HeaderSection />
            </div>
            <TableSection />
        </Layout>
    );
}
