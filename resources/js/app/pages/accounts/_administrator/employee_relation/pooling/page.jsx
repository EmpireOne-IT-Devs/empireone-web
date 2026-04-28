import React, { useEffect } from "react";
import Layout from "../../../layout";
import EmployeeRelationLayout from "../layout";
import PoolingTableSection from "./sections/pooling-table-section";
import SearchPoolingSection from "./sections/search-pooling-section";
import store from "@/app/store/store";
import { get_applicant_pooling_thunk } from "@/app/redux/employee-relation-thunk";

export default function Page() {
    useEffect(() => {
        store.dispatch(get_applicant_pooling_thunk());
    }, []);

    return (
        <Layout>
            <EmployeeRelationLayout>
                <SearchPoolingSection />
                <PoolingTableSection />
            </EmployeeRelationLayout>
        </Layout>
    );
}
