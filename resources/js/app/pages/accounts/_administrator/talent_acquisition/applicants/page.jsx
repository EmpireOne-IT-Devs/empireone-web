import React, { useEffect } from "react";
import Layout from "../../../layout";
import JobPostingLayout from "../layout";
import store from "../../../../../store/store";
import { get_applicants_thunk, get_job_posting_thunk } from "@/app/redux/job-posting-thunk";
import PaginationSection from "./_sections/pagination-section";
import StatusesCardSection from "./_sections/statuses-card-section";
import ExportApplicantSection from "./_sections/export-applicant-section";
import CardApplicantSection from "./_sections/card-applicant-section"

export default function Page() {
    useEffect(() => {
        store.dispatch(get_applicants_thunk());
        store.dispatch(get_job_posting_thunk())
    }, [window.location.search]);

    return (
        <Layout>
            <JobPostingLayout>
                <div className="flex flex-col gap-3">
                    <ExportApplicantSection />
                    <StatusesCardSection />

                    {/* Added the target ID wrapper here so the scroll knows where to land */}
                    <div id="results-table" className="scroll-mt-36">
                        {/* <CardApplicantSection /> */}
                    </div>

                    <PaginationSection />
                </div>
            </JobPostingLayout>
        </Layout>
    );
}