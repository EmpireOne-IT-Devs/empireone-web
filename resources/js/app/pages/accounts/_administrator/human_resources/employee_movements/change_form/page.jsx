import React, { useEffect, useState } from "react";
import Layout from "@/app/pages/accounts/layout";
import EmployeeRelationLayout from "../../layout";
import store from "@/app/store/store";
import { get_employee_change_form_thunk } from "@/app/redux/employee-relation-thunk";
import TabsSection from "../_sections/tabs-section";
import CreateECFSection from "./_sections/create-ecf-section";
import ChangeFormTableSection from "./_sections/change-form-table-section";
import PaginationSection from "./_sections/pagination-section";
import LoadingState from "@/app/_components/loading-state";

export default function Page() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function get_data() {
            try {
                await store.dispatch(get_employee_change_form_thunk());
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
                    <div className="py-3">
                        <div className="flex items-center justify-end">
                            <CreateECFSection />
                        </div>
                        <div className="flex flex-col gap-3">
                            <ChangeFormTableSection />
                            <PaginationSection />
                        </div>
                    </div>
                )}
            </EmployeeRelationLayout>
        </Layout>
    );
}