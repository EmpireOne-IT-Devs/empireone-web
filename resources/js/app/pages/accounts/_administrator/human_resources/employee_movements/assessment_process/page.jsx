import React, { useEffect } from "react";
import Layout from "@/app/pages/accounts/layout";
import TabsSection from "./_sections/tabs-section";
import store from "@/app/store/store";
import { get_performance_evaluation_thunk } from "@/app/redux/employee-relation-thunk";
import EmployeeRelationLayout from "../../layout";
import TableSection from "./_sections/table-section";
import EmployeeMovementsLayout from "../layout";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_performance_evaluation_thunk());
    }, []);

    return (
        <Layout>
            <EmployeeRelationLayout>
                <div className="py-3">
                    <EmployeeMovementsLayout>
                        <TabsSection />
                        <TableSection />
                    </EmployeeMovementsLayout>
                </div>
            </EmployeeRelationLayout>
        </Layout>
    );
}
