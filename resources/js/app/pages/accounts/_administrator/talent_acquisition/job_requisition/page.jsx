import Layout from "../../../layout";
// import HeaderSection from "./_sections/header-section";
import CardSection from "./_sections/card-section";
import SearchSection from "./_sections/search-section";
import JobRequisitionCardSection from "./_sections/job-requisition-card-section";
import { get_job_requisitions_thunk } from "@/app/redux/job-requisition-thunk";
import { useEffect, useState } from "react";
import store from "@/app/store/store";
import JobPostingLayout from "../layout";
import CreateJobRequisition from "./_sections/create-requisition-section";
import { usePage } from "@inertiajs/react";
import { get_job_interviewer_schedule_thunk } from "@/app/redux/app-thunk";
import LoadingState from "@/app/_components/loading-state";

export default function Page() {
    const { url } = usePage();
    const autoOpen =
        new URLSearchParams(url.split("?")[1]).get("create") === "1";

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function get_data() {
            try {
                await Promise.all([
                    store.dispatch(get_job_requisitions_thunk()),
                    store.dispatch(get_job_interviewer_schedule_thunk())
                ]);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }
        get_data();
    }, [url]);

    return (
        <Layout>
            <JobPostingLayout>
                {loading ? (
                    <LoadingState />
                ) : (
                    <div className="space-y-6">
                        {/* <HeaderSection /> */}
                        <CardSection />
                        <SearchSection />
                        <JobRequisitionCardSection />
                        <CreateJobRequisition autoOpen={autoOpen} hideButton />
                    </div>
                )}
            </JobPostingLayout>
        </Layout>
    );
}