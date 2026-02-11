import React, { useEffect, useState } from "react";
import Layout from "../../layout";
import store from "@/app/store/store";
import { get_job_requisitions_by_id_thunk } from "@/app/redux/job-requisition-thunk";
import JobRequisitionBodySection from "./_sections/job-requisition-section";
import Skeleton from "@/app/_components/skeleton";

export default function Page() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function get_data(params) {
            try {
                await store.dispatch(get_job_requisitions_by_id_thunk());
                setLoading(false);
            } catch (error) {}
        }
        get_data();
    }, []);
    return (
        <Layout>
            {!loading && <JobRequisitionBodySection />}
            {loading && (
                <div>
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                </div>
            )}
        </Layout>
    );
}
