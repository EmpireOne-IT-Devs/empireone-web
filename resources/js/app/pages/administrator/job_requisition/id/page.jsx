import React, { useEffect, useState } from "react";
import Layout from "../../layout";
import store from "@/app/store/store";
import { get_job_requisitions_by_id_thunk } from "@/app/redux/job-requisition-thunk";
import JobRequisitionBodySection from "./_sections/job-requisition-section";
import Skeleton from "@/app/_components/skeleton";
import JobRequisitionLogsSection from "./_sections/job-requisition-logs-section";

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
            {!loading && (
                <div className="flex gap-3">
                    <div className="flex-1">
                        <JobRequisitionBodySection />
                    </div>
                    <div className="flex-none w-1/3">
                        <div className="p-6 bg-white shadow rounded-lg space-y-6">
                            <JobRequisitionLogsSection />
                        </div>
                    </div>
                </div>
            )}
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
