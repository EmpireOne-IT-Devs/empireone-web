import React, { useEffect } from "react";
import HeaderSection from "./sections/header-section";
import TableSection from "./sections/table-section";
import Layout from "./../layout";
import store from "@/app/store/store";
import { get_job_offer_by_user_thunk } from "@/app/redux/applicant-thunk";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_job_offer_by_user_thunk());
    }, []);

    return (
        <Layout>
            <div className="flex gap-3 flex-col">
                <HeaderSection />
                <TableSection />
            </div>
        </Layout>
    );
}
