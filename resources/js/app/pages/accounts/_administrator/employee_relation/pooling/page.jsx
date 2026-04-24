import React from "react";
import Layout from "../../../layout";
import EmployeeRelationLayout from "../layout";
import PoolingTableSection from "./sections/pooling-table-section";
import SearchPoolingSection from "./sections/search-pooling-section";

export default function Page() {
    return (
        <Layout>
            <EmployeeRelationLayout>
                <SearchPoolingSection />
                <PoolingTableSection />
            </EmployeeRelationLayout>
        </Layout>
    );
}
