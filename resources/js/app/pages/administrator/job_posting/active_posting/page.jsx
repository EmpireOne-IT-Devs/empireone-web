import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../layout";
import JobPostingLayout from "../layout";
import HeaderSection from "./_sections/header-section";
import SearchSection from "./_sections/search-section";
import JobPostingCardSection from "./_sections/job-posting-card-section";
import { get_job_postings_service_thunk } from "@/app/redux/job-posting-slice";

export default function Page() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(get_job_postings_service_thunk());
    }, [dispatch]);
    return (
        <Layout>
            <JobPostingLayout>
                <div>
                    <div className="flex flex-col gap-2 mt-2">
                        <HeaderSection />
                        <SearchSection />
                    </div>
                    <JobPostingCardSection />
                </div>
            </JobPostingLayout>
        </Layout>
    );
}
