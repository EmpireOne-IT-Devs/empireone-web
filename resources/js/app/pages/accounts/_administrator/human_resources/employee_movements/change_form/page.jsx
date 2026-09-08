import React, { useEffect } from "react";
import Layout from "@/app/pages/accounts/layout";
import EmployeeRelationLayout from "../../layout";
import store from "@/app/store/store";
import { get_employee_change_form_thunk } from "@/app/redux/employee-relation-thunk";
import TabsSection from "../_sections/tabs-section";
import CreateECFSection from "./_sections/create-ecf-section";
import ChangeFormTableSection from "./_sections/change-form-table-section";

export default function Page() {

    useEffect(() => {
        store.dispatch(get_employee_change_form_thunk())
    }, [])
    return (
        <Layout>
            <EmployeeRelationLayout>
                <div className="py-3">
                    <TabsSection />
                    <div className="flex items-center justify-end">
                        <CreateECFSection />
                    </div>
                    <ChangeFormTableSection />
                </div>
            </EmployeeRelationLayout>
        </Layout>
    );
}
