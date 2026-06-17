import React from "react";
import Layout from "../../../layout";
import StoreAdminLayout from "../layout";
import SearchSection from "./sections/search-section";
import RewardTableSection from "./sections/reward-table-section";
import AddRewardSection from "./sections/add-reward-section";

export default function Page() {
    return (
        <Layout>
            <StoreAdminLayout>
                <SearchSection />

                <AddRewardSection />
                <RewardTableSection />
            </StoreAdminLayout>
        </Layout>
    );
}
