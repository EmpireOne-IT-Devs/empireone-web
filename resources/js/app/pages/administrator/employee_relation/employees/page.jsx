import React, { useEffect } from "react";
import Layout from "../../layout";
import TableSection from "./_sections/table-section";
import store from "@/app/store/store";
import { get_employees_thunk } from "@/app/redux/employee-relation-thunk";
import EmployeesLayout from "../layout";
import SearchSection from "./_sections/search-section";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_employees_thunk());
    }, []);
    return (
        <Layout>
            <EmployeesLayout>
                <SearchSection />
                <TableSection />
            </EmployeesLayout>
        </Layout>
    );
}
