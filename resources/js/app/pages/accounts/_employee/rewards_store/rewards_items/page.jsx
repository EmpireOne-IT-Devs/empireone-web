import React from "react";
import Layout from "../../../layout";
import RewardsStoreLayout from "../layout";
import RewardCardSection from "@/app/pages/accounts/_administrator/e_store/rewards_item/sections/reward-card-section";

export default function Page() {
    return (
        <Layout>
            <RewardsStoreLayout>
                <RewardCardSection showManagementActions={false} />
            </RewardsStoreLayout>
        </Layout>
    );
}
