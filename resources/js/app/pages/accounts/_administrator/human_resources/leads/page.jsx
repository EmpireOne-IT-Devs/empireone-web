import React, { useEffect } from "react";
import Layout from "../../../layout";
import EmployeeRelationLayout from "../layout";
import TableSection from "./_sections/table-section";
import CreateLeadSection from "./_sections/create-lead-section";
import { get_job_requisitions_thunk } from "@/app/redux/job-requisition-thunk";
import store from "@/app/store/store";
import { get_leader_thunk } from "@/app/redux/employee-relation-thunk";

export default function Page() {
    useEffect(() => {
        // store.dispatch(get_job_requisitions_thunk());
        store.dispatch(get_leader_thunk())
    }, []);
    return (
        <Layout>
            <EmployeeRelationLayout>
                <div className="flex-col flex gap-3 my-3">
                    <div className="flex w-full items-end justify-end">
                        <CreateLeadSection />
                    </div>
                    <TableSection />
                </div>
            </EmployeeRelationLayout>
        </Layout>
    );
}
