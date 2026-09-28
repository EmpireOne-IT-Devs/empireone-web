import React, { useEffect } from "react";
import Layout from "@/app/pages/accounts/layout";
import EmployeeRelationLayout from "../../layout";
import ApplicantTableSection from "./_sections/applicant-table-section";
import store from "@/app/store/store";
import { get_employee_applicants_thunk, get_leader_thunk } from "@/app/redux/employee-relation-thunk";
import TabsSection from "../_sections/tabs-section";
import PaginationSection from "./_sections/pagination-section";

export default function Page() {

    useEffect(() => {
        store.dispatch(get_employee_applicants_thunk())
        store.dispatch(get_leader_thunk())
    }, [])
    return (
        <Layout>
            <EmployeeRelationLayout>
                <div className="flex flex-col gap-3">
                    <TabsSection />
                    <ApplicantTableSection />
                    <PaginationSection />
                </div>
            </EmployeeRelationLayout>
        </Layout>
    );
}
