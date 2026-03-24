import React, { useEffect } from "react";
import Layout from "../../layout";
import JobPostingLayout from "../layout";
import TableSection from "./_sections/table-section";
import store from "@/app/store/store";
import { get_job_offers_thunk } from "@/app/redux/job-posting-thunk";
import SearchSection from "./_sections/search-section";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_job_offers_thunk(window.location.search));
    }, []);

    return (
        <Layout>
            <JobPostingLayout>
                <SearchSection />
                <TableSection />
            </JobPostingLayout>
        </Layout>
    );
}
