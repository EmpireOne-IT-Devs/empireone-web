import React, { useEffect } from "react";
import Layout from "@/app/pages/accounts/layout";
import EmployeeRelationLayout from "../../layout";
import EmployeeMovementsLayout from "../layout";
import EmployeeChangeFormSection from "./_sections/employee-change-form-section";
import store from "@/app/store/store";
import { get_employee_change_form_thunk, get_employees_thunk, get_leader_thunk } from "@/app/redux/employee-relation-thunk";
import TableSection from "./_sections/table-section";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_employees_thunk());
        store.dispatch(get_leader_thunk())
        store.dispatch(get_employee_change_form_thunk())
    }, []);
    return (
        <Layout>
            <EmployeeRelationLayout>
                <div className="py-3">
                    <EmployeeMovementsLayout>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-end">
                                <EmployeeChangeFormSection />
                            </div>
                            <TableSection />
                        </div>
                    </EmployeeMovementsLayout>
                </div>
            </EmployeeRelationLayout>
        </Layout>
    );
}
