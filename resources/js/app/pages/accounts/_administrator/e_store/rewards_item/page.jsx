import React from "react";
import Layout from "../../../layout";
import StoreAdminLayout from "../layout";
import RewardCardSection from "./sections/reward-card-section";
import SearchSection from "./sections/search-section";

export default function Page() {
    return (
        <Layout>
            <StoreAdminLayout>
               
                <SearchSection />

              <RewardCardSection />
            </StoreAdminLayout>
        </Layout>
    );
}
