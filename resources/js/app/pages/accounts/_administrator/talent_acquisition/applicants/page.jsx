import React, { useEffect, useState } from "react";
import Layout from "../../../layout";
import JobPostingLayout from "../layout";
import store from "../../../../../store/store";
import { get_applicants_thunk, get_job_posting_thunk } from "@/app/redux/job-posting-thunk";
import PaginationSection from "./_sections/pagination-section";
import StatusesCardSection from "./_sections/statuses-card-section";
import ExportApplicantSection from "./_sections/export-applicant-section";
import CardApplicantSection from "./_sections/card-applicant-section";
import LoadingState from "@/app/_components/loading-state";

export default function Page() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function get_data() {
            try {
                await Promise.all([
                    store.dispatch(get_applicants_thunk()),
                    store.dispatch(get_job_posting_thunk())
                ]);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }
        get_data();
    }, [window.location.search]);

    return (
        <Layout>
            <JobPostingLayout>
                {loading ? (
                    <LoadingState />
                ) : (
                    <div className="flex flex-col gap-3">
                        <ExportApplicantSection />
                        <StatusesCardSection />
                        <div id="results-table" className="scroll-mt-36">
                            <CardApplicantSection />
                        </div>

                        <PaginationSection />
                    </div>
                )}
            </JobPostingLayout>
        </Layout>
    );
}