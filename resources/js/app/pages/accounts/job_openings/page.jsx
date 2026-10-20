import React, { useEffect } from "react";
import HeaderSection from "./sections/header-section";
import SearchSection from "./sections/search-section";
import JobPostingCardSection from "./sections/job-posting-card-section";
import Layout from "./../layout";
import store from "@/app/store/store";
import { get_job_posting_thunk } from "@/app/redux/job-posting-thunk";
import PaginationSection from "./sections/pagination-section";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_job_posting_thunk());
    }, []);

    return (
        <Layout>
            <HeaderSection />
            <SearchSection />
            <div className="flex flex-col gap-5">
                <JobPostingCardSection />
                <PaginationSection />
            </div>
        </Layout>
    );
}
