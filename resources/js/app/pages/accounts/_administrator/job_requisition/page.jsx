import Layout from "../../layout";
import HeaderSection from "./_sections/header-section";
import CardSection from "./_sections/card-section";
import SearchSection from "./_sections/search-section";
import JobRequisitionCardSection from "./_sections/job-requisition-card-section";
import { get_job_requisitions_thunk } from "@/app/redux/job-requisition-thunk";
import { useEffect } from "react";
import store from "@/app/store/store";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_job_requisitions_thunk());
    }, []);
    return (
        <Layout>
            <div className="space-y-6">
                <HeaderSection />
                <CardSection />
                <SearchSection />
                <JobRequisitionCardSection />
            </div>
        </Layout>
    );
}
