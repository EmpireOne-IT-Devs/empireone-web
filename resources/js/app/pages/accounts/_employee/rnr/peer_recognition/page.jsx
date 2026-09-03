import React from "react";
import Layout from "@/app/pages/accounts/layout";
import RnrLayout from "../layout";
import RewardCardSection from "@/app/pages/accounts/_administrator/rnr/peer_recognition/sections/reward-card-section";

export default function Page() {
    return (
        <Layout>
            <RnrLayout>
                <div className="mt-4">
                    <RewardCardSection />
                </div>
            </RnrLayout>
        </Layout>
    );
}