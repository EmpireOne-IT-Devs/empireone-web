import React, { useEffect } from "react";
import Layout from "@/app/pages/accounts/layout";
import TabsSection from "./_sections/tabs-section";
import store from "@/app/store/store";
import { get_leader_thunk, get_performance_evaluation_thunk } from "@/app/redux/employee-relation-thunk";
import EmployeeRelationLayout from "../../layout";
import TableSection from "./_sections/table-section";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_performance_evaluation_thunk());
        store.dispatch(get_leader_thunk())
    }, []);

    return (
        <Layout>
            <EmployeeRelationLayout>
                <div className="py-3">
                   <TabsSection />
                        <TableSection />
                </div>
            </EmployeeRelationLayout>
        </Layout>
    );
}
