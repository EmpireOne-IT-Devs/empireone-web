import React from "react";
import Layout from "../../../layout";
import RewardsStoreLayout from "../layout";
import RedemptionTableSection from "@/app/pages/accounts/_administrator/e_store/redemption_history/sections/redemption-table-section";

export default function Page() {
    return (
        <Layout>
            <RewardsStoreLayout>
                <RedemptionTableSection />
            </RewardsStoreLayout>
        </Layout>
    );
}
