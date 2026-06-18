import React from "react";
import Layout from "../../../layout";
import StoreAdminLayout from "../layout";
import RewardTableSection from "./sections/reward-table-section";
import SearchSection from "./sections/search-section";

export default function Page() {
    return (
        <Layout>
            <StoreAdminLayout>
               
                <SearchSection />

                <RewardTableSection />
            </StoreAdminLayout>
        </Layout>
    );
}
