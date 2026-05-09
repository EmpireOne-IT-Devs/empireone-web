import React, { useEffect, useState } from "react";
import Layout from "../../../../layout";
import HeaderSection from "./_sections/header-section";
import SearchSection from "./_sections/search-section";
import TableSection from "./_sections/table-section";
import BackSection from "./_sections/back-section";
import store from "@/app/store/store";
import { get_job_application_by_id_thunk, get_job_posting_thunk } from "@/app/redux/job-posting-thunk";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_job_application_by_id_thunk());
        store.dispatch(get_job_posting_thunk());
    }, []);
    return (
        <Layout>
            <BackSection />
            <HeaderSection />
            <div className=" flex flex-col gap-5">
                {/* Table Container */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Toolbar */}
                    <SearchSection />
                    <TableSection />
                </div>
            </div>
        </Layout>
    );
}
