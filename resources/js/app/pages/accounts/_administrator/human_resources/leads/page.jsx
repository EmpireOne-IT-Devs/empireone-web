import React, { useEffect, useState } from "react";
import Layout from "../../../layout";
import EmployeeRelationLayout from "../layout";
import TableSection from "./_sections/table-section";
import CreateLeadSection from "./_sections/create-lead-section";
import store from "@/app/store/store";
import { get_leader_thunk } from "@/app/redux/employee-relation-thunk";
import LoadingState from "@/app/_components/loading-state";

export default function Page() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function get_data() {
            try {
                await store.dispatch(get_leader_thunk());
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }
        get_data();
    }, [window.location.search]);

    return (
        <Layout>
            <EmployeeRelationLayout>
                {loading ? (
                    <LoadingState />
                ) : (
                    <div className="flex-col flex gap-3 my-3">
                        <div className="flex w-full items-end justify-end">
                            <CreateLeadSection />
                        </div>
                        <TableSection />
                    </div>
                )}
            </EmployeeRelationLayout>
        </Layout>
    );
}