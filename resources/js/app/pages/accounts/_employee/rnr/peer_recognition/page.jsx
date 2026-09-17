import React, { useState } from "react";
import Layout from "@/app/pages/accounts/layout";
import RnrLayout from "../layout";
import RewardCardSection from "@/app/pages/accounts/_administrator/rnr/peer_recognition/sections/reward-card-section";
import AwardCategorySection from "@/app/pages/accounts/_administrator/rnr/peer_recognition/award-category-section";

export default function Page() {
    const [selectedCategory, setSelectedCategory] = useState("All Awards");

    return (
        <Layout>
            <RnrLayout>
                <div className="mt-4 space-y-4">
                     <AwardCategorySection onChange={setSelectedCategory} />
                    <RewardCardSection selectedCategory={selectedCategory} />
                </div>
            </RnrLayout>
        </Layout>
    );
}