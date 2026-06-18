import React from "react";
import Layout from "../../../layout";
import StoreAdminLayout from "../layout";
import RedemptionTableSection from "./sections/redemption-table-section";

export default function Page() {
    return (
        <Layout>
            <StoreAdminLayout>
                <RedemptionTableSection />
            </StoreAdminLayout>
        </Layout>
    );
}
