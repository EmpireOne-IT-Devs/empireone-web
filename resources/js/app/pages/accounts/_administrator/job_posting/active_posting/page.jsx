import React, { useEffect } from "react";
import Layout from "../../../layout";
import JobPostingLayout from "../layout";
import HeaderSection from "./_sections/header-section";
import JobPostingCardSection from "./_sections/job-posting-card-section";
import { get_job_posting_thunk } from "@/app/redux/job-posting-thunk";
import store from "@/app/store/store";

export default function Page() {

    useEffect(() => {
        store.dispatch(get_job_posting_thunk())
    }, []);
    return (
        <Layout>
            <JobPostingLayout>
                <div>
                    <div className="flex flex-col gap-2 mt-2">
                        <HeaderSection />
                    </div>
                    <JobPostingCardSection />
                </div>
            </JobPostingLayout>
        </Layout>
    );
}
