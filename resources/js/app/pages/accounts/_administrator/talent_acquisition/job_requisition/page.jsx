import Layout from "../../../layout";
import HeaderSection from "./_sections/header-section";
import CardSection from "./_sections/card-section";
import SearchSection from "./_sections/search-section";
import JobRequisitionCardSection from "./_sections/job-requisition-card-section";
import { get_job_requisitions_thunk } from "@/app/redux/job-requisition-thunk";
import { useEffect } from "react";
import store from "@/app/store/store";
import JobPostingLayout from "../layout";
import CreateJobRequisition from "./_sections/create-requisition-section";
import { usePage } from "@inertiajs/react";
import { get_job_interviewer_schedule_thunk } from "@/app/redux/app-thunk";

export default function Page() {
    const { url } = usePage();
    const autoOpen =
        new URLSearchParams(url.split("?")[1]).get("create") === "1";

    useEffect(() => {
        store.dispatch(get_job_requisitions_thunk());
        store.dispatch(get_job_interviewer_schedule_thunk());
    }, [url]);

    return (
        <Layout>
            <JobPostingLayout>
                <div className="space-y-6">
                    <HeaderSection />
                    <CardSection />
                    <SearchSection />
                    <JobRequisitionCardSection />
                    <CreateJobRequisition autoOpen={autoOpen} hideButton />
                </div>
            </JobPostingLayout>
        </Layout>
    );
}
