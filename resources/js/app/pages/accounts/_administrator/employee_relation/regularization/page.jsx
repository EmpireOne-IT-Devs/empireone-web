import React, { useEffect } from "react";
import Layout from "../../../layout";
import EmployeeRelationLayout from "../layout";
import store from "@/app/store/store";
import { get_probationary_thunk } from "@/app/redux/employee-relation-thunk";
import TableSection from "./_sections/table-section";

export default function page() {
    useEffect(() => {
        store.dispatch(get_probationary_thunk());
    }, []);
    return (
        <Layout>
            <EmployeeRelationLayout>
                <div className="mt-10">
                    <TableSection />
                </div>
            </EmployeeRelationLayout>
        </Layout>
    );
}
