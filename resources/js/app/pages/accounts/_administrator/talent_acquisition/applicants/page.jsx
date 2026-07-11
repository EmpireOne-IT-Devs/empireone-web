import React, { useEffect } from "react";
import Layout from "../../../layout";
import JobPostingLayout from "../layout";
// import HeaderSection from "./_sections/header-section";
import CardSection from "./_sections/card-section";
// import SearchSection from "./_sections/search-section";
import store from "../../../../../store/store";
import { get_applicants_thunk, get_job_posting_thunk } from "@/app/redux/job-posting-thunk";
import ApplicantTableSection from "./_sections/applicant-table-section";
import SearchStatusSection from "./_sections/search-status-section";
import PaginationSection from "./_sections/pagination-section";
import StatusesCardSection from "./_sections/statuses-card-section";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_applicants_thunk());
        store.dispatch(get_job_posting_thunk())
    }, [window.location.search]);

    return (
        <Layout>
            <JobPostingLayout>
                <div className="flex flex-col gap-3">
                    {/* <HeaderSection /> */}
                    <CardSection />
                    <SearchStatusSection />

                    {/* Search and Stats trigger the scroll */}
                    <StatusesCardSection />

                    {/* Added the target ID wrapper here so the scroll knows where to land */}
                    <div id="results-table" className="scroll-mt-6">
                        <ApplicantTableSection />
                    </div>

                    <PaginationSection />
                </div>
            </JobPostingLayout>
        </Layout>
    );
}