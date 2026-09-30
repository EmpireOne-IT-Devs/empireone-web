import React, { useEffect, useState } from "react";
import Layout from "@/app/pages/accounts/layout";
import EmployeeRelationLayout from "../../layout";
import ApplicantTableSection from "./_sections/applicant-table-section";
import store from "@/app/store/store";
import { get_employee_applicants_thunk, get_leader_thunk } from "@/app/redux/employee-relation-thunk";
import TabsSection from "../_sections/tabs-section";
import PaginationSection from "./_sections/pagination-section";
import LoadingState from "@/app/_components/loading-state";

export default function Page() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function get_data() {
            try {
                await Promise.all([
                    store.dispatch(get_employee_applicants_thunk()),
                    store.dispatch(get_leader_thunk())
                ]);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }
        get_data();
    }, []);

    return (
        <Layout>
            <EmployeeRelationLayout>
                <TabsSection />
                {loading ? (
                    <LoadingState />
                ) : (
                    <div className="flex flex-col gap-3">
                        <ApplicantTableSection />
                        <PaginationSection />
                    </div>
                )}
            </EmployeeRelationLayout>
        </Layout>
    );
}