import React, { useEffect } from "react";
import Layout from "../layout";
import TableSection from "./_sections/table-section";
import HeaderSection from "./_sections/header-section";
import SearchSection from "./_sections/search-section";
import StatsSection from "./_sections/stats-section";
import store from "@/app/store/store";
import { get_documents_by_user_thunk } from "@/app/redux/applicant-thunk";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_documents_by_user_thunk());
    }, []);
    return (
        <Layout>
            <div className="flex flex-col gap-3 w-full">
                <HeaderSection />
                <SearchSection />
                <StatsSection />
                <TableSection />
            </div>
        </Layout>
    );
}
