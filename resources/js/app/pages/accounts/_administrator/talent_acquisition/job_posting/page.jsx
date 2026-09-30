import React, { useEffect, useState } from "react";
import Layout from "../../../layout";
import JobPostingLayout from "../layout";
import HeaderSection from "./_sections/header-section";
import JobPostingCardSection from "./_sections/job-posting-card-section";
import { get_job_posting_thunk } from "@/app/redux/job-posting-thunk";
import store from "@/app/store/store";
import TableSection from "./_sections/table-section";
import ExportJobPosting from "./_sections/export-job-posting";
import LoadingState from "@/app/_components/loading-state";

export default function Page() {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function get_data(params) {
            try {
                await store.dispatch(get_job_posting_thunk())
                setLoading(false)
            } catch (error) {
                setLoading(false)
            }
        }
        get_data()
    }, [window.location.search]);

    return (
        <Layout>
            <JobPostingLayout>
                {
                    loading ? <LoadingState /> : <div>
                        <div className="w-full flex items-center justify-end py-3">
                            <ExportJobPosting />
                        </div>
                        <TableSection />
                    </div>
                }
            </JobPostingLayout>
        </Layout>
    );
}
